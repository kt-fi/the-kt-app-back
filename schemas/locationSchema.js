import  mongoose  from "mongoose";

const locationSchema = new mongoose.Schema({
  status: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
});

locationSchema.index({ location: '2dsphere' });

export default  mongoose.model('Location', locationSchema);