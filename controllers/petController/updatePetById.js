import Pet from "../../schemas/petSchema.js";
import HttpError from "../../httpError.js";
import Location from "../../schemas/locationSchema.js";
import e from "express";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";

const updatePetById = async (req, res, next) => {
  const petIdParam = req.params.petId;
  let locationRemoved;

  const {
    userId,
    petId,
    petName,
    age,
    animalType,
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

<<<<<<< HEAD
=======
  console.log(req.body);  
>>>>>>> d9285d0 (minor changes)

  if (
    locationLastSeen !== undefined &&
    typeof locationLastSeen.lat === "number" &&
    typeof locationLastSeen.lon === "number"
  ) {
    coords = [locationLastSeen.lon, locationLastSeen.lat]; // GeoJSON order
  }

  if (!petIdParam) {
    const error = new HttpError("Pet ID is required", 400);

    return res.status(400).json({ msg: error.message });
  }

  try {
    pet = await Pet.findOne({ _id: petIdParam }).populate("locationLastSeen");

    if (!pet) {
      const error = new HttpError("Pet Not Found", 404);

      return res.status(404).json({ msg: error.message });
    }

  
    await Location.findOneAndDelete({ _id: pet.locationLastSeen });
    

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
      locationLastSeenDoc = await new Location({
        status: status,
        location: { type: "Point", coordinates: [coords[1], coords[0]] },
      });
      await locationLastSeenDoc.save();
    }

    // Update pet
    pet.age = age;
    pet.animalType = animalType;
    pet.description = description;
    pet.otherInfo = otherInfo;
    pet.status = status;
    pet.locationLastSeen = locationLastSeenDoc ? locationLastSeenDoc._id : null;
    
    await pet.save();

    await pet.populate("locationLastSeen");

    return res.json(pet);
  } catch (err) {
    const errorLog = new ErrorLogMessage({
          message: err.message,
          component: "  Update Pet By ID Controller Backend",
          level: "error",
          timestamp: new Date(),
          notes: null,
          currentSatus: "new",
        });
        await errorLog.save();
    const error = new HttpError("Error Updating Pet", 500);

    return res.status(500).json({ msg: error.message });
  }
};

export default updatePetById;
