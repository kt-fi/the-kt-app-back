import Chat from "../../schemas/chatSchema.js";
import User from "../../schemas/userSchema.js";
import Pet from "../../schemas/petSchema.js";



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
        console.log(err)
    }
}

export default checkForExistingChat;