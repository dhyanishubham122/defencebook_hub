const mongoose=require('mongoose');
const adminSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role: {
        type:String,
        default:'admin',
        enum:['admin','superadmin'],
    }},
    {
        timestamps:true //crate the cratedat and updated at 
    }
)
const Admin=mongoose.model('Admin',adminSchema);
module.exports=Admin;