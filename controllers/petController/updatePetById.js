import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";
import Location from "../../schemas/locationSchema.js";
import e from "express";

const updatePetById = async (req, res, next) => {
  const petIdParam = req.params.petId;
  let locationRemoved;

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
  let coords = null;

  let pet;

  if (
    locationLastSeen !== undefined &&
    typeof locationLastSeen.lat === "number" &&
    typeof locationLastSeen.lon === "number"
  ) {
    coords = [locationLastSeen.lon, locationLastSeen.lat]; // GeoJSON order
  }

  if (!petIdParam) {
    const error = new HttpError("Pet ID is required", 400);
    console.log(error);
    return res.status(400).json({ msg: error.message });
  }

  try {
    pet = await Pet.findOne({ petId: petIdParam });

    if (!pet) {
      const error = new HttpError("Pet Not Found", 404);
      console.log(error);
      return res.status(404).json({ msg: error.message });
    }

    if(status === "safe") {
      locationRemoved = await Location.findOneAndDelete({ _id: pet.locationLastSeen });
    }

    if (coords == null) {
      locationLastSeenDoc = await Location.findOne({
        _id: pet.locationLastSeen,
      });
    }

    // Update location
    
    if (
      !locationLastSeenDoc &&
      coords !== null &&
      status === "missing"
    ) {
      locationLastSeenDoc = new Location({
        status: status,
        location: { type: "Point", coordinates: [coords[1], coords[0]] },
      });
      await locationLastSeenDoc.save();
    }

    // Update pet
    pet.age = age;
    pet.description = description;
    pet.otherInfo = otherInfo;
    pet.status = status;
    pet.dateLastSeen = dateLastSeen;
    pet.locationLastSeen = locationLastSeenDoc ? locationLastSeenDoc._id : null;
    await pet.save();

    return res.json(pet);
  } catch (err) {
    const error = new HttpError("Error Updating Pet", 500);
    console.log(err);
    return res.status(500).json({ msg: error.message });
  }
};

export default updatePetById;
