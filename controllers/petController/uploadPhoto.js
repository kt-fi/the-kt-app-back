import HttpError from "../../httpError.js";

const uploadPhoto = async (req, res, next) => {
  console.log("File upload request received");
  if (!req.file) {
    const error = new HttpError("No file uploaded", 400);
    return res.status(400).json({ msg: error.message });
  }

  const urlParts = req.file.path.split('/upload/');
  const publicId = urlParts[1].replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');
  console.log('Cloudinary public_id:', publicId);
  res.json({
    msg: "File uploaded successfully",
    fileUrl: req.file.path,
    publicId,
  });
};

export default uploadPhoto;