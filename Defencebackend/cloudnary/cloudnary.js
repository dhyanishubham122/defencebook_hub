const cloudinary=require('cloudinary').v2;
const fs=require('fs');
const dotenv = require('dotenv');
const path=require('path')
dotenv.config();
cloudinary.config({ 
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME, 
    api_key: process.env.CLOUDNARY_API_KEY, 
    api_secret: process.env.CLOUDNARY_API_SECRET_KEY 
}); 

const uploadoncloudinary = async(localfilepath)=>{
    console.log("localfilepatname",localfilepath);
      // Configuration
  
      
    // Upload an image
  try {
    if(!localfilepath){
        console.log("local filepath is null")
        return null;
    }
    const filename = path.parse(localfilepath).name;

      const uploadResult = await cloudinary.uploader
      .upload(
          localfilepath, {
              resource_type: 'auto',
              public_id: filename, // Setting original filename as public_id
              overwrite: true, // If re-uploaded, it replaces the old file
          }
      )
      console.log("file uploaded",uploadResult);
      fs.unlinkSync(localfilepath);

      return uploadResult.secure_url;
  } 
  catch (error) {
     // Delete the file in case of an error
     if (fs.existsSync(localfilepath)) {
        fs.unlinkSync(localfilepath);
    }
    
    return null;
  }
 
 
}

module.exports=uploadoncloudinary;