import mongoose from "mongoose";

const Schema = mongoose.Schema;

let petSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
  petName: { type: String, require: true },
  age: { type: Number, require: true },
  animalType: { type: String, require: true },
  description: { type: String, require: true },
  otherInfo: { type: String, require: false },
  photoIds: [{ type: String, require: false }],
  status: { type: String, require: true },
  dateLastSeen: { type: Date, default: Date.now },
  dateFound: { type: Date, default: Date.now, require: false },
  locationLastSeen: { type: Schema.Types.ObjectId, ref: "Location" },
  spottedLocations: [{ type: [Number, Number] }], // [longitude, latitude]],
});

export default mongoose.model("Pet", petSchema);
