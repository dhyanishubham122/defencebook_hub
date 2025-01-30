const mongoose=require('mongoose');
const connectDb=async()=>{
    try{
       const conn= await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
       })
    }
    catch(error){
        console.log(`Error:${error}`);
        process.exit(1);
    }
}
module.exports=connectDb;