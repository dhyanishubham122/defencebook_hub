const Admin= require('./models/Admin');
const mongoose = require('mongoose');

const bcrypt=require('bcryptjs');
mongoose.connect('mongodb://localhost:27017/defence', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const createAdminUser = async () => {
    try {
        const existingUser = await Admin.findOne({ email: 'admin@example.com' });
        if (existingUser) {
            console.log('Admin already exists');
            return;
        }

        // Hash the password for security
        const hashedPassword = await bcrypt.hash('adminpassword', 10);

        // Create the admin user
        const admin = new Admin({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',  // You can change this to 'superadmin' for superadmin
        });

        // Save the new admin to the database
        await admin.save();
        console.log('Admin user created successfully!');
    } catch (err) {
        console.error('Error creating admin:', err);
    }
};

const createSuperAdminUser = async() =>{
    try{
  const existingUSer=await Admin.findOne({email:'Shubhamdhyani39@gmail.com'});
  if(existingUSer){
    console.log("admin already exist");
    return;
  }
  const hashedPassword=await bcrypt.hash('Shubham@123',10);
    const admin=new Admin({
        username:'shubham',
        email:'shubhamdhyani39@gmail.com',
        password:hashedPassword,
        role:'superadmin'
        });
         await admin.save();
         console.log("super admin created succesfully");
  }

 
    catch(error){
        console.log(`error:${error}`);  
    }
};
// createAdminUser();
createSuperAdminUser();