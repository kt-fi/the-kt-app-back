import Chat from "../../schemas/chatSchema.js";
import User from "../../schemas/userSchema.js";
import Pet from "../../schemas/petSchema.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";


const checkForExistingChat = async (req, res, next) => {
    const { userId, petId } = req. params;

    let foundChat;
    console.log(userId, petId)

    try{
        foundChat = await Chat.findOne({ petId: petId, participants: userId }).populate("participants").populate("petId");
        if (!foundChat) {
            return res.status(200).json({ msg: "No existing chat found", chat: null });
        }
        res.status(200).json({chat: foundChat });
    }catch(err) {
         const errorLog = new ErrorLogMessage({
              message: err.message,
              component: "Check For Existing Chat Controller Backend",
              level: "error",
              timestamp: new Date(),
              notes: null,
              currentSatus: "new",
            });
            await errorLog.save();
            const error = new HttpError("Failed to check for existing chat", 500);
            return res.status(500).json({ msg: error.message });
    }
}

export default checkForExistingChat;