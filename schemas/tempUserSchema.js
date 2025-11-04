import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const tempUserSchema = new Schema({
       userId: { type: String, require: true },
       userName: { type: String, require: true },
       email: { type: String, require: false },
       password: { type: String, require: false },
       telephone: { type: Number, require: false },
       address: { type: String, require: false },
       location: { type: String, require: false },
       pets: [{ type: mongoose.Types.ObjectId, require: false, ref: 'Pet'}],
       chats: [{ type: mongoose.Types.ObjectId, require: true, ref: 'Chat'}]
})

export default mongoose.model('TempUser', tempUserSchema);
