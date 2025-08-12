const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let petSchema = new Schema({
    userId: { type: String, require: true },
    petId: { type: String, require: true },
    petName: { type: String, require: true },
    age: { type: Number, require: true},
    description: { type: String, require: true },
    otherInfo: { type: String, require: false },
    image: { type: String, require: false },
    status: {type: String, require: true},
    dateLastSeen: { type: Date, default: Date.now },
    locationLastSeen: {type: [Number], require: false},
})

module.exports = mongoose.model('Pet', petSchema)