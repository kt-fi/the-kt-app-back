const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();



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

// Initialize multer with Cloudinary storage
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


module.exports = upload;