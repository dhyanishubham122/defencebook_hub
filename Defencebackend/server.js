const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const connectDb=require('./config/db');
const adminRoutes = require('./routes/adminRoutes');  // Import the admin routes
const path = require('path');
const userRoutes=require('./routes/userRoutes')

dotenv.config();//load environment variable
const app=express();

const PORT=process.env.PORT||5000;
connectDb();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());
// Use the routes for admin-related requests
app.use('/admin', adminRoutes);
app.use('/user',userRoutes);
app.get('/', (req, res) => {
    res.send('Backend is running!');
});
app.get('/shubham',(req,res)=>{
    res.send('Hello Shubham');
})

app.listen(PORT,()=>console.log(`server is running on port no ${PORT}`));
