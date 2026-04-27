import Pet from "../../schemas/petSchema.js";
import User from "../../schemas/userSchema.js";
import Message from "../../schemas/messageSchema.js";
import Chat from "../../schemas/chatSchema.js";
import Location from "../../schemas/locationSchema.js";
import HttpError from "../../httpError.js";
import cloudinary from "../../utils/cloudinary.js";
import mongoose from "mongoose";

const deletePetById = async (req, res, next) => {
  const petId = req.params.petId;

  const sess = await mongoose.startSession();
  sess.startTransaction();

  try {
    console.log(" Deleting pet with ID:", petId);
    const pet = await Pet.findOneAndDelete({ _id: petId }, { session: sess });
    if (!pet) {
      await sess.abortTransaction();
      sess.endSession();

      const error = new HttpError("Pet Not Found", 404);
     
      return res.status(404).json({ msg: error.message });
    }

    const user = await User.findOne({ _id: pet.userId }, null, {
      session: sess,
    });

    user.pets.pull(pet._id);
    await user.save({ session: sess });
    await removeAllImages(pet.photoIds);
    await removeRelatedChats(pet._id);
    
    // await removeLastSeenLocation(pet.locationLastSeen);
    await sess.commitTransaction();
    sess.endSession();

    // await removeSpottedLocationDocuments(pet.spottedLocaions);
 

    res.json({ msg: "Pet Deleted Successfully", petId: pet._id });
  } catch (err) {
    await sess.abortTransaction();
    sess.endSession();
    const error = new HttpError("Error Deleting Pet", 500);
    return res.status(500).json( err );
  }
};

async function removeSpottedLocationDocuments(spottedLocaions) {
  if (spottedLocaions && spottedLocaions.length > 0) {
    for (const locationId of spottedLocaions) {
      await Location.findOneAndDelete({ _id: locationId },
        { session: sess },
      );
    }
  }
}

async function removeLastSeenLocation(locationLastSeen) {
  if (pet.locationLastSeen) {
      const locationDocument = await Location.findOneAndDelete(
        { _id: pet.locationLastSeen },
        { session: sess },
      );
      // if (!locationDocument) {
      //   await sess.abortTransaction();
      //   sess.endSession();
      //   const error = new HttpError("Location Not Found", 404);
      //   return res.status(404).json({ msg: error.message });
      // }
  } 
}

async function removeAllImages(photoIds) {
  if (photoIds && photoIds.length > 0) {
    photoIds.forEach((photoId) => {
      cloudinary.uploader.destroy(
        `ktApp-petMainPic/${photoId}`,
        function (error, result) {
          console.log(result, error);
        },
      );
    });
  }
}

async function removeRelatedChats(petId) {
  try {
    const chats = await Chat.find({ petId: petId });
    for (const chat of chats) {
      const chatMessages = await Message.find({ chatId: chat._id });
      for (const message of chatMessages) {
        await Message.findOneAndDelete({ _id: message._id });
      }
      await Chat.findOneAndDelete({ _id: chat._id },
      { session: sess },
      );
    }
  } catch(err) {
    console.log("Error removing related chats:", err);
  }
}

export default deletePetById;
