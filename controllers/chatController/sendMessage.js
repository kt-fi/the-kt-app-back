import Message from "../../schemas/messageSchema.js";
import User from "../../schemas/userSchema.js";
import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";
import Chat from "../../schemas/chatSchema.js";
import mongoose from "mongoose";

const sendMessage = async (req, res, next) => {
  const { petId, chatId, senderId, message, location, image, recipientId } = req.body;

  // Validate ObjectIds BEFORE querying
  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(recipientId) ||
    !mongoose.Types.ObjectId.isValid(petId)
  ) {
    return res.status(400).json({ msg: "Invalid senderId, recipientId, or petId" });
  }

  const sess = await mongoose.startSession();
  sess.startTransaction();

  try {
    let recipient = await User.findOne({ _id: recipientId }).session(sess);
    let sender = await User.findOne({ _id: senderId }).session(sess);
    let pet = await Pet.findOne({ _id: petId }).session(sess);

    if (!recipient || !sender) {
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
        participants: [senderId, recipientId],
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
      senderId,
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
    await sess.abortTransaction();
    sess.endSession();
    next(error);
  }
};

export default sendMessage;
// filepath: d:\Programming\Katie App 2024\the-kt-