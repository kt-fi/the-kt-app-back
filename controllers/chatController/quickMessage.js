import mongoose from "mongoose";
import Chat from "../../schemas/chatSchema.js";
import User from "../../schemas/userSchema.js";
import Pet from "../../schemas/petSchema.js";
import Message from "../../schemas/messageSchema.js";
import Location from "../../schemas/locationSchema.js";

const quickMessage = async (req, res, next) => {
  const { message, recipientId, petId, location } = req.body;
  let chat;
  let pet;
  let recipient;
  let locationCoords;

  let newMessage;

  try {
    recipient = await User.findOne({ _id: recipientId });
    pet = await Pet.findOne({ _id: petId });

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    let sess = await mongoose.startSession();
    await sess.startTransaction();
    if (location !== undefined && location !== null && location.length === 2) {
      locationCoords = new Location({
        status: "missing",
        location: {
          type: "Point",
          coordinates: location,
        },
      });
      await locationCoords.save({ session: sess });
      pet.spottedLocations.push(locationCoords._id);
      await pet.save({ session: sess });
    }

    chat = await new Chat({
      petId: pet._id,
      messages: [],
      participants: [recipient._id],
    }).save({ session: sess });
    newMessage = await new Message({
      chatId: chat._id,
      location: locationCoords._id,
      senderId: null,
      message: message,
      sentAt: new Date(),
    }).save({ session: sess });

    recipient.chats.push(chat._id);
    chat.messages.push(newMessage._id);
    await pet.save({ session: sess });
    await recipient.save({ session: sess });
    await chat.save({ session: sess });
    await sess.commitTransaction();

    res.json({ message: "Quick message sent", chat, newMessage });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export default quickMessage;
