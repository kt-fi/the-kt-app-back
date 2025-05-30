const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: { type: String, require: true },
    userName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    telephone: { type: Number, require: false },
    address: { type: String, require: false },
    location: { type: String, require: false },
    pets: [{ type: mongoose.Types.ObjectId, require: false, ref: 'Pet'}]
})

module.exports = mongoose.model('User', userSchema)