const express=require('express');
const Book=require('../models/Books');
const router=express.Router();
const path=require('path');
const jwt=require('jsonwebtoken');
const bcrypt=require("bcryptjs");
const User =require('../models/User')
const authUserMiddleware=require('../middleware/authUserMiddleware')
// chat  routes 
const Conversation = require("../models/conversation");
// Start a new conversation
  router.post('/conversation', async (req, res) => {
    try {
      const { senderId, receiverId } = req.body;

      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
      });

      if (!conversation) {
        // No conversation found, create a new one
        conversation = new Conversation({
          participants: [senderId, receiverId],
          messages: [],
          lastMessage: null,
        });

        await conversation.save();
      }

      res.status(200).json(conversation);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  router.post('/message', async (req, res) => {
    try {
      const { conversationId, senderId, content } = req.body;
  
      let newMessage = {
        sender: senderId,
        content,
        timestamp: new Date(),
        read: false,
      };
  
      let conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { 
          $push: { messages: newMessage }, 
          $set: { lastMessage: newMessage }
        },
        { new: true } // Return updated conversation
      );
  
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
  
      res.status(200).json(conversation);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  router.get('/chat/:conversationId', async (req, res) => {
    try {
      const { conversationId } = req.params;
      let conversation = await Conversation.findById(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      const messages = conversation.messages || [];  // Ensure messages is always an array
      
      if (messages.length === 0) {
        return res.status(201).json({ message: "No messages" });  // Use return to prevent multiple responses
      }
      
      return res.status(200).json(messages);  // Always use return when sending a response
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });  // Ensure return in catch block
    }
  });
  
  
// end chat routes 




router.get('/profile',authUserMiddleware,async(req,res)=>{
  try{
   const data=req.user;
  
   res.status(200).json(data);
  }
  catch(err){
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
})

router.post('/login',async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user) 
      return res.status(400).json({message:'Invalid email or password'})

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch)
      return res.status(400).json({message:'Invalid credential admin'});
    const token=jwt.sign({id:user._id,name:user.username,email:user.email}, process.env.JWT_SECRET,{expiresIn:'1h'});

    res.json({token});

}
catch(err){
  console.log(err);
}
})
router.post('/signup', async (req, res) => {
  try {
      const { username, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(409).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const user = new User({ username, email, password: hashedPassword });
      await user.save();

      res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put("/toggle-chat", authUserMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.chatEnabled = !user.chatEnabled;
    await user.save();

    return res.status(200).json({ 
      chatEnabled: user.chatEnabled, 
      message: `Chat ${user.chatEnabled ? "enabled" : "disabled"}` 
    });

  } catch (err) {
    console.log("Error toggling chat:", err); 
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/chat-status",authUserMiddleware,async(req,res)=>{
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ chatEnabled: user.chatEnabled });
  }
  catch(err){
    console.log("Error getting chat status:",err);
  }
})
router.get("/online-user",authUserMiddleware,async(req,res)=>{
  try{
   const userId=req.user.id;
   
   const user=await User.find({chatEnabled:true})
   if(!user){
    return res.status(404).json({message:"No user online"})
   }
   return res.status(200).json({onlineUsers:user})
  }
  catch(err){
    console.log("Error getting online user:",err);
  }
})

// router.get('/book',async(req,res)=>{
//     try{
//         const {category,title,author}=req.query;
//         const filter={};
//         if(category) filter.category=category;
//         if(title) filter.title=title;
//         if(author) filter.author=author
//         const books=await Book.find(filter).sort({createdAt:-1});
//         // const books = await Book.find(filter.length ? { $or: filter } : {}).sort({ createdAt: -1 });

//         res.json(books);
//     }
//     catch(err){
//         res.status(500).json({ message: err.message });

//     }
// })
router.get('/book', async (req, res) => {
  try {
      const { category, title, author, topRated } = req.query; // Added `topRated` query param
      const filter = {};

      if (category) filter.category = category;
      if (title) filter.title = title;
      if (author) filter.author = author;

      if (topRated === "true") {
          filter.rating = 5; // Filter for books with a rating of 5
      }

      let query = Book.find(filter).sort({ createdAt: -1 });
      // let query =Book.find(filter.length > 0 ? { $or: filter } : {}).sort({ createdAt: -1 });

      if (topRated === "true") {
          query = query.limit(3); // Limit to 3 books only if `topRated=true`
      }

      const books = await query;
      if (books.length === 0) {
        return res.status(404).json({ message: "No result found" });
    }
      res.json(books);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});






router.get('/book/:id',async(req,res)=>{
    try{
        const id=req.params.id;
        console.log(id);
        const book=await Book.findById(id);
        if(!book) 
            return res.status(404).json({ message: "Book not found" });
            res.json(book);
            }
            catch(err){
                res.status(500).json({ message: err.message });
                }
})
// GET route for general search
router.get('/search', async (req, res) => {
    try {
      const { keyword } = req.query;
  
      if (!keyword) {
        return res.status(400).json({ message: "Search keyword is required" });
      }
  
      console.log("Search keyword:", keyword);  // Add debugging line
  
      const books = await Book.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { author: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 });
  
      console.log("Found books:", books);  // Log the found books for debugging
  
      res.json(books);
    } catch (err) {
      console.error("Error in search route:", err);
      res.status(500).json({ message: err.message });
    }
  });
  const categoryDescriptions = {
    war: 'Explore books about the history and strategies of war.',
    victories: 'Discover stories of great victories and triumphs.',
    training: 'Learn about military training and discipline.',
    defence: 'Understand the principles of national defence.',
    terrorism: 'Read about the fight against terrorism.',
    officertalk: 'Insights and experiences from military officers.',
    other: 'Miscellaneous books on various topics.'
  };
router.get('/categories', async (req, res) => {
    try {
      // Fetch the enum values from the Book model
      const categories = Book.schema.path('category').enumValues.map(cat => ({
        name: cat,
        description: categoryDescriptions[cat]
      }));;
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error });
    }
  });
  

module.exports=router;