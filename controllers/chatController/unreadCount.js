import Chat from "../../schemas/chatSchema.js";

const unreadCount = async (req, res, next) => {
  const userId = req.params.userId; 
    try {
        const chats = await Chat.find({ participants: userId }).populate('messages');
        let totalUnreadCount = 0;
        for (const chat of chats) {
            const unreadMessages = chat.messages.filter(
                (msg) => msg.senderId.toString() !== userId && !msg.seen
            );
            totalUnreadCount += unreadMessages.length;
        }   
        console.log(`Total unread messages for user ${userId}: ${totalUnreadCount}`);
        return res.status(200).json({ unreadCount: totalUnreadCount });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Server error", error: err.message });
    }
};
export default unreadCount;