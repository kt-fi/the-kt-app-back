import mongoose, { Mongoose } from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: false,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: [Number, Number], // [longitude, latitude]
  },
  image: {
    type: String, // URL or base64 string
    required: false,
  },
  sentAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  seen: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model("Message", messageSchema);
