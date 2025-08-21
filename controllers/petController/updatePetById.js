import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";
import Location from "../../schemas/locationSchema.js";

const updatePetById = async (req, res, next) => {
  const petIdParam = req.params.petId;
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

  let locationLastSeenDoc;
  let coords;

  console.log("locationLastSeen:", locationLastSeen);

  if (
    typeof locationLastSeen.lat === "number" &&
    typeof locationLastSeen.lon === "number"
  ) {
    coords = [locationLastSeen.lat, locationLastSeen.lon];
    console.log(coords, locationLastSeen);
  } else {
    const error = new HttpError("Invalid coordinates", 422);
    res.json({ msg: error.message });
    return next(error);
  }

  if (!petIdParam) {
    const error = new HttpError("Pet ID is required", 400);
    res.json({ msg: error.message });
    return next(error);
  }

  try {
    console.log(coords);
    let pet = await Pet.findOne({ petId: petIdParam });

    if (pet) {
      locationLastSeenDoc = await Location.findOne({
        _id: pet.locationLastSeen,
      });
      if (!locationLastSeenDoc) {
        const error = new HttpError("Location Not Found", 404);
        res.json({ msg: error.message });
        return next(error);
      }
    }

    if (!pet) {
      const error = new HttpError("Pet Not Found", 404);
      res.json({ msg: error.message });
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("failed to get pet", 500);
    res.json({ msg: error.message });
    return next(err);
  }

  try {
    console.log("p" + coords);
    locationLastSeenDoc = await Location.findOneAndUpdate(
      { _id: locationLastSeenDoc._id },
      {
        $set: {
          status: status,
          location: { type: "Point", coordinates: coords },
        },
      },
      { new: true }
    );

    await locationLastSeenDoc.save();
  } catch (err) {
    const error = new HttpError("failed to set location", 500);
    res.json({ msg: error.message });
    return next(err);
  }

  try {
    let pet = await Pet.findOneAndUpdate(
      { petId: petIdParam },
      { $set: { description, otherInfo, status } }
    );
    await pet.save();
    if (!pet) {
      const error = new HttpError("Pet Not Found", 404);
      res.json({ msg: error.message });
      return next(error);
    }
    return res.json(pet);
  } catch (err) {
    const error = new HttpError("Error Updating Pet", 500);
    res.json({ msg: error.message });
    return next(err);
  }
};

export default updatePetById;
