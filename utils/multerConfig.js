import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();


const storage = new CloudinaryStorage({
  
  cloudinary: cloudinary,
  params: {
    folder: "ktApp-petMainPic", // Folder name in your Cloudinary account
    // allowed_formats: ["jpg", "jpeg", "png", "JPG", "gif"], // Allowed file formats
    // transformation: [
    //   { width: 400, height: 300, crop: "fill", quality: "auto:eco" } // Add quality here
    // ],

    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\s+/g, "_");
      return `${originalName}`; // Unique file name -- May Change to include timestamp
    },
  },
});


// Initialize multer with Cloudinary storage
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});


export default upload;