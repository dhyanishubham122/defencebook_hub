const mongoose=require('mongoose');
const bookSchema=new mongoose.Schema(
    {
        title:{type:String,required:true,trim:true,unique: true,},
        author:{type:String,required:true},
        description:{type:String,required:true,trim:true},
        category:{type:String,required:true,enum:['war','victories','training','defence','terrorism','officertalk','other']},
        rating:{type:Number,required:true,min:1,max:5},
        pdfUrl:{type:String,required:true},
        image:{type:String,required:true},
        purchasedLinkUrl:{type:String},
    },{
        timestamps:true,
    }
);
const Book=mongoose.model('Book',bookSchema);
module.exports=Book;