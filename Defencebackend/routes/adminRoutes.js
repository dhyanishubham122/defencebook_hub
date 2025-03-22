const express=require('express');
const bcrypt= require('bcrypt');
const multer=require('multer');
const axios = require('axios');

const jwt= require('jsonwebtoken');
const Admin=require('../models/Admin');
const Book=require('../models/Books');
const router=express.Router();
const path=require('path');
const verifyTokenandRole=require('../middleware/authAdminMiddleware');
const fs = require("fs");
const uploadOnCloudinary=require('../cloudnary/cloudnary.js')
const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  };
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath;
  
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        uploadPath = path.join(__dirname, "../uploads");
      } else if (file.mimetype === "application/pdf") {
        uploadPath = path.join(__dirname, "../uploads/pdf");
      } else {
        return cb({ message: "Unsupported file format" }, false);
      }
  
      ensureDirectoryExists(uploadPath); // Ensure the directory exists
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + "-" + file.originalname;
      cb(null, filename);
    },
  });
  
  const upload = multer({ storage: storage });
  
  // to add new books
  router.post(
    "/add",
    verifyTokenandRole(),
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "pdf", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        console.log("Received Files:", req.files);
      console.log("Received Body:", req.body);
        const { title, author, description, category, rating, purchasedLinkUrl } = req.body;
  
        // Extract uploaded file paths
        // const image = req.files["image"] ? `uploads/${req.files["image"][0].filename}` : "";
        // const pdfUrl = req.files["pdf"] ? `uploads/pdf/${req.files["pdf"][0].filename}` : "";
        let image = req.files["image"]?.[0]?.path ? await uploadOnCloudinary(req.files["image"][0].path) : "";
        let pdfUrl = req.files["pdf"]?.[0]?.path ? await uploadOnCloudinary(req.files["pdf"][0].path) : "";
         console.log("image ",image);
         console.log("pdfUrl",pdfUrl);
         if (!image || !pdfUrl) {
          return res.status(400).json({ message: "Image and PDF are required." });
        }
  
        // Check if the book already exists
        const existingBook = await Book.findOne({ title });
        if (existingBook) {
          return res.status(400).json({ message: "Book already exists in the database." });
        }
  
        // Create and save the book
        const newBook = new Book({
          title,
          author,
          description,
          category,
          rating,
          pdfUrl,
          image,
          purchasedLinkUrl,
        });
  
        await newBook.save();
        return res.status(200).json({ message: "Book added successfully!", book: newBook });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: `Server Error: ${error.message}` });
      }
    }
  );
  

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const admin=await Admin.findOne({email});
        if(!admin)
            return res.status(400).json({message:'Invalid email or password/ No admin'});
        const isMatch=await bcrypt.compare(password,admin.password);
        if(!isMatch)
            return res.status(400).json({message:'Invalid credential admin'});
        const token= jwt.sign({id:admin._id, role:admin.role,name:admin.username}, process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});
    }
    catch(error){

        console.log(`Error:${error}`);
    }
});

router.put('/profileupdate',verifyTokenandRole(),async(req,res)=>{
    const {email,password,newpassword}=req.body;
    console.log("emai is:",email);
    console.log("password is:",password);
    console.log("newpassword is:",newpassword);

  try{
   const admin= await Admin.findOne({email})
    if(!admin)
        return res.status(400).json({message:'Invalid email or password/ No admin'});
   const isMatch=await bcrypt.compare(password,admin.password);
   if(!isMatch)
    return res.status(400).json({ message: 'Invalid email or password' });
   const hashedNewPassword = await bcrypt.hash(newpassword, 10);
   const updatedAdmin = await Admin.findByIdAndUpdate(
    admin._id,
    { $set: { password: hashedNewPassword } },
    { new: true }
);

return res.status(200).json({ message: 'Password updated successfully' });
}
  catch(err){
    console.log(`error is ${err}`);
  }
});

router.get('/profile',verifyTokenandRole(),async(req,res)=>{
   try{
    const admin=await Admin.findById(req.user.id).select('-password');
    console.log("admin is:",admin);
    if(!admin){
        return res.status(404).json({message:'Admin not found'});}
   return res.json(admin);
   }
   catch(error){
    console.log(error);
    return res.status(500).json({message:'server error'});
   }
});
//  CRUD routes 


router.get('/books', async (req, res) => {
    try {
        const { category, page = 1, limit = 9 } = req.query;
        const query = category ? { category } : {};
        const books = await Book.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Book.countDocuments(query);
        res.status(200).json({
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'server error' });
    }
});
// to get single book by id
router.get('/book/:id',async(req,res)=>{
    try{
       const book=await Book.findById(req.params.id);
       if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'server error'});
    }
})
// to update a book
router.put('/updatebook/:id',verifyTokenandRole(),upload.single('image'),async(req,res)=>{
    try{
        const {title,author,description,category, rating, pdfUrl, purchasedLinkUrl}=req.body;
        const image=`uploads/${req.file.filename}` ;
        console.log("res.body is:",req.body);
        console.log("req.file is :",image);
        const updatedBook=await Book.findByIdAndUpdate(req.params.id,{title,author,description,category, rating, pdfUrl, image, purchasedLinkUrl},{new:true});
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'server error'});
    }
})
// to delete a book
router.delete('/delete/:id', verifyTokenandRole('superadmin'),async(req,res)=>{
      try{
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
      }
      catch(error){
        console.log(error);
        res.status(500).json({message:'server error'});
    }

});

// to filters book by category 
router.get('category/:category',async(req,res)=>{
    try{
        const books=await Book.find({category:req.params.category});
        if (!books || books.length === 0) {
            return res.status(404).json({ message: 'No books found in this category' });
        }
        res.status(200).json(books);
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'server error'});
    }
})

// for ai
router.post('/api/openai', async (req, res) => {
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
  
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch AI response' });
    }
  });
  

module.exports=router;