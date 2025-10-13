import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const tempUserSchema = new Schema({
    userName: { type: String, require: false },
    email: { type: String, require: false },
    token: { type: String, require: true },
    chats: [{ type: mongoose.Types.ObjectId, require: false, ref: 'Chat'}]
})

export default mongoose.model('TempUser', tempUserSchema);
