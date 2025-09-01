import mongoose from "mongoose";
import Pet from "../../schemas/petSchema.js";
import User from "../../schemas/userSchema.js";
import Location from "../../schemas/locationSchema.js";
import HttpError from "../../httpError.js";

const addNewPet = async (req, res, next) => {
  // Uncomment and use if you want validation
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new HttpError(errors.array().map(e => e.msg).join(', '), 422);
  //   res.status(422).json({ msg: error.message });
  //   return next(error);
  // }

  const {
    userId,
    petId,
    petName,
    age,
    description,
    otherInfo,
    image,
    status,
    dateLastSeen,
    locationLastSeen,
  } = req.body;

  let user;
  let newPet;
  let locationLastSeenDoc;
  let coords;

  const sess = await mongoose.startSession();
  await sess.startTransaction();

  try {
    // Only create a Location if status is "missing" and locationLastSeen is provided
    if (status === "missing" && locationLastSeen) {
      if (
        typeof locationLastSeen.lat === "number" &&
        typeof locationLastSeen.lon === "number"
      ) {
        // GeoJSON expects [longitude, latitude]
        coords = [locationLastSeen.lat, locationLastSeen.lon];
      } else {
        coords = null;
      }

      if (!coords) {
        throw new HttpError("Invalid coordinates", 422);
      }

      locationLastSeenDoc = new Location({
        status: status,
        location: {
          type: "Point",
          coordinates: coords,
        },
      });
      await locationLastSeenDoc.save({ session: sess });
    }

    newPet = new Pet({
      userId,
      petId,
      petName,
      age,
      description,
      otherInfo,
      image: `https://res.cloudinary.com/daxrovkug/image/upload/v1746460136/ktApp-petMainPic/${petId}.jpg`,
      status,
      dateLastSeen,
      locationLastSeen: locationLastSeenDoc ? locationLastSeenDoc._id : null,
    });

    await newPet.save({ session: sess });

    user = await User.findOne({ userId });
    if (!user) {
      await sess.abortTransaction();
      const error = new HttpError("User Not Found", 404);
      return res.status(404).json({ msg: error.message });

    }

    user.pets.push(newPet);
    await user.save({ session: sess });

    await sess.commitTransaction();
    sess.endSession();
    console.log(newPet)
    res.json(newPet);
    return;
    } catch (err) {
    await sess.abortTransaction();
    sess.endSession();
    const error = err instanceof HttpError
      ? err
      : new HttpError(err.message || "Unexpected Error", 500);
    return res.status(error.statusCode).json({ msg: error.message });
  }
};

export default addNewPet;