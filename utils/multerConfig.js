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
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file formats
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.replace(/\s+/g, "_");
      return `${originalName}`; // Unique file name -- May Change to include timestamp
    },
  },
});

console.log('Multer configured with Cloudinary storage');
// Initialize multer with Cloudinary storage
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 5MB
  },
});


export default upload;