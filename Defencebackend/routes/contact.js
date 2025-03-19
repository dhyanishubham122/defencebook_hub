const express=require('express');
const router=express.Router();
const path=require('path');
const dotenv =require('dotenv');
const nodemailer=require('nodemailer');
dotenv.config();

router.post('/contactform',async (req,res)=>{
    const {name,email,message}=req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    const transporter=nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
       }
    })

  try{
    const info=await transporter.sendMail({
        from:email,
        to:'shubhamdhyani39@gmail.com',
        subject:' defence book Hub',
        text:message,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Message:</strong> ${message}</p>`
    })
    if(!info.messageId){
        return res.status(400).json({message:'Error sending mail', messageId: info.messageId})
    }
    res.json({message:'Email sent successfully'})
}
catch(err){
    console.log("err is ",err);
    res.status(500).json({ message: 'Internal server error' });

}
})

module.exports=router;