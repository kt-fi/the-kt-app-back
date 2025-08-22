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

  if (
    typeof locationLastSeen.lat === "number" &&
    typeof locationLastSeen.lon === "number"
  ) {
    coords = [locationLastSeen.lon, locationLastSeen.lat]; // GeoJSON order
  } else {
    const error = new HttpError("Invalid coordinates", 422);
    res.status(422).json({ msg: error.message });
    return next(error);
  }

  if (!petIdParam) {
    const error = new HttpError("Pet ID is required", 400);
    res.status(400).json({ msg: error.message });
    return next(error);
  }

  try {
    const pet = await Pet.findOne({ petId: petIdParam });

    if (!pet) {
      const error = new HttpError("Pet Not Found", 404);
      res.status(404).json({ msg: error.message });
      return next(error);
    }

    locationLastSeenDoc = await Location.findOne({
      _id: pet.locationLastSeen,
    });

    if (!locationLastSeenDoc) {
      const error = new HttpError("Location Not Found", 404);
      res.status(404).json({ msg: error.message });
      return next(error);
    }

    // Update location
    locationLastSeenDoc.status = status;
    locationLastSeenDoc.location = { type: "Point", coordinates: coords };
    await locationLastSeenDoc.save();

    // Update pet
    pet.description = description;
    pet.otherInfo = otherInfo;
    pet.status = status;
    await pet.save();

    return res.json(pet);
  } catch (err) {
    const error = new HttpError("Error Updating Pet", 500);
    res.status(500).json({ msg: error.message });
    return next(error);
  }
};

export default updatePetById;