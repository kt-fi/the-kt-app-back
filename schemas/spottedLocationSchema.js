import mongoose from 'mongoose';

const Schema = mongoose.Schema;


let SpottedLocationSchema = new Schema({
    location: mongoose.Types.ObjectId, ref: 'Location',
    photo:{ type: String, require: false },
})

export default mongoose.model('SpottedLocation', SpottedLocationSchema);