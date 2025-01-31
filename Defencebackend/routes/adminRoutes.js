const express=require('express');
const bcrypt= require('bcrypt');
const multer=require('multer');

const jwt= require('jsonwebtoken');
const Admin=require('../models/Admin');
const Book=require('../models/Books');
const router=express.Router();
const path=require('path');
const verifyTokenandRole=require('../middleware/authAdminMiddleware');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        console.log('File will be saved to:', uploadPath);  // Optional debugging line
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + '-' + file.originalname;
        cb(null, filename )
    }
  })
  
  const upload = multer({ storage: storage })
//   router.post('/shubham',upload.single('image'),(req,res)=>{
//     res.send("uploaded");
//   })
// to add new books
router.post('/add', verifyTokenandRole()  ,upload.single('image'),async(req,res)=>{
    try{
       const {title,author,description,category, rating, pdfUrl, purchasedLinkUrl}=req.body;
    //    const image = req.file ? req.file.path : ''; // Get the file path
       const image=`uploads/${req.file.filename}` ;// Save the relative path
       const existingBook = await Book.findOne({ title });
       if (existingBook) {
        return res.status(400).json({ message: 'Book already exists in the database.' });
        }
        const newBook= new Book({
            title,
            author,
            description,
            category,
            rating,
            pdfUrl,
            image,
            purchasedLinkUrl
        })
        await newBook.save();
        return res.status(200).json({message:'done'});
    }
    catch(error){
        console.log(error);
        res.status(301).json({message:`${error}`});
    }
})

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




// to get all books
// router.get('/books',async(req,res)=>{
//     try{
//         const books=await Book.find();
//         res.status(200).json(books);
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({message:'server error'});
//     }
// });
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
router.delete('/delete', verifyTokenandRole('superadmin'),async(req,res)=>{
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

module.exports=router;