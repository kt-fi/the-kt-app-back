import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to create storage config
const createCloudinaryStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png", "JPG", "gif"],
      transformation: [
        { width: 400, height: 300, crop: "fill", quality: "auto:eco" }
      ],
      public_id: (req, file) => {
        const originalName = file.originalname.replace(/\s+/g, "_");
        return `${originalName}`;
      },
    },
  });
};

// Create different upload instances for different folders
export const uploadPetMainPic = multer({
  storage: createCloudinaryStorage("ktApp-petMainPic"),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadProfilePic = multer({
  storage: createCloudinaryStorage("ktApp-profilePic"),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadAlbumPhoto = multer({
  storage: createCloudinaryStorage("ktApp-albumPhotos"),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Default export for backward compatibility
export default uploadPetMainPic;