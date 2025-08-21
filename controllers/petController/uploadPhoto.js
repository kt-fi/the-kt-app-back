import HttpError from "../../httpError.js";


const uploadPhoto = async (req, res, next) => {
  if (!req.file) {
    const error = new HttpError("No file uploaded", 400);
    res.json({ msg: error.message });
    return next(error);
  }

  res.json({
    msg: "File uploaded successfully",
    fileUrl: req.file.path, // Cloudinary URL
  });
};


export default uploadPhoto;