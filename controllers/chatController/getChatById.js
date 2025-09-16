import Chat from "../../schemas/chatSchema.js";
import mongoose from "mongoose";
import HttpError from "../../httpError.js";

const getChatById = async (req, res, next) => {
  const { chatId } = req.params;            
    try {   
        const chat = await Chat.findById(chatId).populate('messages'); // Exclude password field
        if (!chat) {
            let err = new HttpError("Chat not found", 404);
            res.status(404).json({ msg: err.message });
            return next(err);
        }
        return res.status(200).json({ chat });
    } catch (err) {
        let error = new HttpError("Server error", 500);
        res.status(500).json({ msg: error.message });
        return next(error);
    }
};
export default getChatById;