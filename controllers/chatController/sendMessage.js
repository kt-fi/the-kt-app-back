import Message from "../../schemas/messageSchema.js";
import User from "../../schemas/userSchema.js";
import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";
import Chat from "../../schemas/chatSchema.js";

import { sendToToken } from "../../utils/sendToToken.js"; // adjust path as needed

import DeviceToken from "../../schemas/deviceTokenSchema.js";

import { io } from "../../app.js"; // <-- Add this import
import mongoose from "mongoose";

const sendMessage = async (req, res, next) => {
  const { chatId, senderId, message, location, image } = req.body.message;
  const recipientId = req.body.recipientId;
  const petId = req.body.petId;

  const contactChatUrl = `${process.env.WEB_APP_URL}/pet/contact/${petId}`;

  console.log(req.body);

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

    let userToken = await DeviceToken.findOne({ userId: recipientId }).session(
      sess,
    );

    if (!sender) {
      console.error("Recipient or sender not found");
      await sess.abortTransaction();
      sess.endSession();
      return res.status(404).json({ msg: "Recipient or sender not found" });
    } else {
      console.log(sender.userName);
    }

    let chat = null;
    if (chatId && mongoose.Types.ObjectId.isValid(chatId)) {
      chat = await Chat.findOne({ _id: chatId }).session(sess);
    }

    if (userToken?.token) {
      try {
        const token = userToken.token;
        const title = `Message about ${pet.petName}`;
        const body = message || "You have a new message";

        // Build data for notification (string values)
        const chatId = String(chat?._id || "");
        const chatUrl = contactChatUrl;

        console.log("Preparing to send notification with data:", { chatUrl });

        const data = {
          chatId,
          chatUrl,
          type: "chat_message",
          senderId: String(senderId || ""),
        };

        console.log(
          "Sending push notification to token (masked):",
          `${token.slice(0, 8)}...${token.slice(-6)}`,
        );
        // Pass 'web' as platform so sendToToken uses webpush.notification
        await sendToToken(token, title, body, data, "web");
      } catch (notificationError) {
        console.error("Failed to send push notification:", notificationError);
      }
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

    if (newMessage.location) {
      pet.spottedLocations.push(newMessage.location);
      await pet.save({ session: sess });
    }

    chat.messages.push(newMessage._id);
    await chat.save({ session: sess });

    await sess.commitTransaction();
    sess.endSession();

    // SOCKET FUNCTIONALITY
    if (recipientId && chat && newMessage) {
      io.to(recipientId).emit("new_message", {
        newMessage,
        petId,
        image:
          pet.photoIds.length > 0 && pet.photoIds
            ? pet.photoIds[0]
            : pet.petName.charAt(0).toUpperCase(),
      });
    }

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
