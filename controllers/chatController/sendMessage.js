import Message from "../../schemas/messageSchema.js";
import User from "../../schemas/userSchema.js";
import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";
import Chat from "../../schemas/chatSchema.js";
import mongoose from "mongoose";

const sendMessage = async (req, res, next) => {

  const { chatId, petId, senderId, message, location, image } = req.body.message;
  const recipientId = req.body.recipientId;



  // if (
  //   !senderId ||
  //   !recipientId ||
  //   !petId
  // ) {
    
  //   console.error("Invalid senderId, recipientId, or petId");
  //   return res.status(400).json({ msg: "Invalid senderId, recipientId, or petId" });
  // }

  const sess = await mongoose.startSession();
  sess.startTransaction();

  try {
    let recipient = await User.findOne({ _id: recipientId }).session(sess);
    let sender = await User.findOne({ _id: senderId }).session(sess);
    let pet = await Pet.findOne({ _id: petId }).session(sess);

    // console.log("Recipient:", recipient);
    // console.log("Sender:", sender);
    // console.log("Pet:", pet);

    if (!sender) {
      console.error("Recipient or sender not found");
      await sess.abortTransaction();
      sess.endSession();
      return res.status(404).json({ msg: "Recipient or sender not found" });
    }

    let chat = null;
    if (chatId && mongoose.Types.ObjectId.isValid(chatId)) {
      chat = await Chat.findOne({ _id: chatId }).session(sess);
    }

    if (!chat) {
      chat = new Chat({
        petId: pet._id,
        participants: [sender._id, recipient._id],
        messages: [],
      });
      await chat.save({ session: sess });
      recipient.chats.push(chat._id);
      sender.chats.push(chat._id);
      await recipient.save({ session: sess });
      await sender.save({ session: sess });
    }

    const newMessage = new Message({
      chatId: chat._id,
      senderId: sender._id,
      message,
      location,
      image,
    });

    await newMessage.save({ session: sess });

    chat.messages.push(newMessage._id);
    await chat.save({ session: sess });

    await sess.commitTransaction();
    sess.endSession();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    await sess.abortTransaction();
    sess.endSession();
    next(error);
  }
};

export default sendMessage;
// filepath: d:\Programming\Katie App 2024\the-kt-app