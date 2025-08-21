const addNewPet = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(errors.array().map(e => e.msg).join(', '), 422);
    res.status(422).json({ msg: error.message });
    return next(error);
  }

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
    // Validate and set coordinates
    if (
      locationLastSeen &&
      typeof locationLastSeen.lat === "number" &&
      typeof locationLastSeen.lon === "number"
    ) {
      coords = [locationLastSeen.lon, locationLastSeen.lat]; // GeoJSON order
    } else {
      coords = null;
    }

    if (!coords) {
      throw new Error("Invalid coordinates");
    }

    if(!coords=== null){
      locationLastSeenDoc = await new Location({
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
      locationLastSeen: locationLastSeenDoc._id || null
    });

    await newPet.save({ session: sess });

    user = await User.findOne({ userId });
    if (!user) {
      await sess.abortTransaction();
      const error = new HttpError("User Not Found", 404);
      res.status(404).json({ msg: error.message });
      return next(error);
    }

    user.pets.push(newPet);
    await user.save({ session: sess });

    await sess.commitTransaction();
    sess.endSession();

    res.json(newPet);
  } catch (err) {
    await sess.abortTransaction();
    sess.endSession();
    const error = new HttpError(err.message || "Unexpected Error", 500);
    res.status(500).json({ msg: error.message });
    return next(error);
  }
};

export default addNewPet;