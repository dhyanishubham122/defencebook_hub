require("dotenv").config();
const connectDb = require('./config/db');
connectDb();

const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const Book = require("./models/Books.js"); // Adjust as per your project

// 🔹 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET_KEY,
});


// 🔹 Function to Upload to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return null;
    }

    const filename = path.parse(filePath).name;
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      public_id: filename, // Keep original name
      overwrite: true,
    });

    console.log(`✅ Uploaded: ${result.secure_url}`);
    fs.unlinkSync(filePath); // Delete local file after upload
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Upload failed for ${filePath}:`, error);
    return null;
  }
};

// 🔹 Migrate All Books
const migrateBooks = async () => {
  try {
    const books = await Book.find({});
    console.log(`Found ${books.length} books to migrate`);

    for (const book of books) {
      let updatedFields = {};

      // Process Image Upload
      if (book.image && book.image.startsWith("uploads/")) {
        const localImagePath = path.resolve(__dirname, book.image);
        const imageUrl = await uploadToCloudinary(localImagePath);
        if (imageUrl) updatedFields.image = imageUrl;
      }

      // Process PDF Upload
      if (book.pdfUrl && book.pdfUrl.startsWith("uploads/")) {
        const localPdfPath = path.resolve(__dirname, book.pdfUrl);
        const pdfUrl = await uploadToCloudinary(localPdfPath);
        if (pdfUrl) updatedFields.pdfUrl = pdfUrl;
      }

      // ✅ Ensure only `image` and `pdfUrl` are updated (No other field changes)
      if (Object.keys(updatedFields).length > 0) {
        await Book.updateOne({ _id: book._id }, { $set: updatedFields });
        console.log(`📌 Updated Book: ${book.title}`);
      }
    }

    console.log("🚀 Migration Complete!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Migration Error:", error);
    mongoose.connection.close();
  }
};

// Start Migration
migrateBooks();
