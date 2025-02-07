const express=require('express');
const Book=require('../models/Books');
const router=express.Router();
const path=require('path');
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