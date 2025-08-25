import HttpError from "../../httpError.js";

const uploadPhoto = async (req, res, next) => {
  console.log('called')
  if (!req.file) {
    const error = new HttpError("No file uploaded", 400);
    console.log('no file')
    return res.status(400).json({ msg: error.message });
  }

  res.json({
    msg: "File uploaded successfully",
    fileUrl: req.file.path, // Cloudinary URL
  });
};

export default uploadPhoto;