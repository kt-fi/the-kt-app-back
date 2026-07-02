import cloudinaryV2 from "../../utils/cloudinary.js";
import Pet from "../../schemas/petSchema.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const removePetPhoto = async (req, res) => {
  const { petId, userId, photoId } = req.body;

  console.log('called')

  try {
    const pet = await Pet.findById(petId);
    if (pet.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to remove photo from this pet" });
    }
    const photoIndex = pet.photoIds.indexOf(photoId);
    if (photoIndex === -1) {
      return res
        .status(404)
        .json({ msg: "Photo not found in pet's photo list" });
    }
    pet.photoIds.splice(photoIndex, 1);
    await pet.save();
    await removePetFromCloudinary(photoId);
    res.status(200).json({ pet });

    

  } catch (err) {
    res
      .status(500)
      .json({ msg: "Error removing photo from pet", error: err.message });
  }
};

async function removePetFromCloudinary(photoId) {
  console.log('removePetFromCloudinary called with photoId:', photoId);
  cloudinaryV2.uploader.destroy(
        photoId,
        function (error, result) {
          console.log(result, error);
        }
      );
}



export default removePetPhoto;