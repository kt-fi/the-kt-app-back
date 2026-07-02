import HttpError from "../httpError.js";
import cloudinary from "./cloudinary.js";
import mongoose from "mongoose";
import Chat from "../schemas/chatSchema.js";
import Message from "../schemas/messageSchema.js";
import Location from "../schemas/locationSchema.js";



async function deletePet(pet) {
  await removeAllImages(pet.photoIds);
  await removeRelatedChats(pet._id);
  await removeLastSeenLocation(pet);
}

async function deleteUser(user) {
     // remove user
}



async function removeAllImages(photoIds) {
  try {
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
  } catch (err) {
    console.log("Error removing images:", err);
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
      await Chat.findOneAndDelete({ _id: chat._id });
    }
  } catch (err) {
    console.log("Error removing related chats:", err);
  }
}

async function removeLastSeenLocation(pet) {
  try {
    if (pet.locationLastSeen) {
      const locationDocument = await Location.findOneAndDelete(
        { _id: pet.locationLastSeen },
      );
      if (!locationDocument) {
        const error = new HttpError("Location Not Found", 404);
        return res.status(404).json({ msg: error.message });
      }
    }
  } catch (err) {
    console.log("Error removing last seen location:", err);
  }
}

export { deletePet, deleteUser };
