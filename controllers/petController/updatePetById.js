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
    locationLastSeen !== undefined &&
    typeof locationLastSeen.lat === "number" &&
    typeof locationLastSeen.lon === "number"
  ) {
    coords = [locationLastSeen.lat, locationLastSeen.lon]; // GeoJSON order
  } else {
    const error = new HttpError("Invalid coordinates", 422);
    return res.status(422).json({ msg: error.message });
  }

  if (!petIdParam) {
    const error = new HttpError("Pet ID is required", 400);
    return res.status(400).json({ msg: error.message });
  }

  try {
    const pet = await Pet.findOne({ petId: petIdParam });

    if (!pet) {
      const error = new HttpError("Pet Not Found", 404);
      return res.status(404).json({ msg: error.message });

    }

    locationLastSeenDoc = await Location.findOne({
      _id: pet.locationLastSeen,
      
    }
    );

    if (!locationLastSeenDoc) {
      const error = new HttpError("Location Not Found", 404);
      return res.status(404).json({ msg: error.message });

    }

    // Update location
    locationLastSeenDoc.status = status;
    locationLastSeenDoc.location = { type: "Point", coordinates: coords };
    console.log('new', locationLastSeenDoc);
    await locationLastSeenDoc.save();

    // Update pet
    pet.age = age;
    pet.description = description;
    pet.otherInfo = otherInfo;
    pet.status = status;
    pet.dateLastSeen = dateLastSeen;
    await pet.save();

    return res.json(pet);
  } catch (err) {
    const error = new HttpError("Error Updating Pet", 500);
    return res.status(500).json({ msg: error.message });
  }
};

export default updatePetById;