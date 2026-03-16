import  mongoose  from "mongoose";

const deviceTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        enum: ['ios', 'android', 'web'],
        required: true
    }
});


export default  mongoose.model('DeviceToken', deviceTokenSchema);