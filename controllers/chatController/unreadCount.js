import Chat from "../../schemas/chatSchema.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const unreadCount = async (req, res, next) => {
  const userId = req.params.userId; 
    try {
        const chats = await Chat.find({ participants: userId }).populate('messages');
        let totalUnreadCount = 0;
        for (const chat of chats) {
            const unreadMessages = chat.messages.filter(
                (msg) => {
                    if(msg.senderId !== null){
                        if (msg.senderId.toString() !== userId && !msg.seen) {
                        return msg;
                    }
                    } 
                    if (msg.senderId == null && !msg.seen) {
                        return msg;
                    }
                }
            );
            totalUnreadCount += unreadMessages.length;
        }   
        console.log(`Total unread messages for user ${userId}: ${totalUnreadCount}`);
        return res.status(200).json({ unreadCount: totalUnreadCount });
    } catch (err) {
         const errorLog = new ErrorLogMessage({
              message: err.message,
              component: "Unread Count Controller Backend",
              level: "error",
              timestamp: new Date(),
              notes: null,
              currentSatus: "new",
            });
            await errorLog.save();
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
};
export default unreadCount;