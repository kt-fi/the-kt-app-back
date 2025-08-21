// import Pet from "../../schemas/petSchema.js";
// import User from "../../schemas/userSchema.js";
// import HttpError from "../../httpError.js";
// import { uuid } from "uuidv4";
// import mongoose from "mongoose";
// import { validationResult } from "express-validator";
// import cloudinary from "../../utils/cloudinary.js";
// import Location from "../../schemas/locationSchema.js";

export { default as addNewPet } from './addNewPet.js';
export { default as getPetsByUserId } from './getPetsByUserId.js';
export { default as uploadPhoto } from './uploadPhoto.js';
export { default as getAllLostPets } from './getAllLostPets.js';
export { default as deletePetById } from './deletePetById.js';
export { default as updatePetById } from './updatePetById.js';

// const addNewPet = async (req, res, next) => {
//   let errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     let error = new HttpError(errors);
//     console.log(errors);
//     res.json({ msg: error.message }).status(422);
//     return next(error);
//   }

//   const {
//     userId,
//     petId,
//     petName,
//     age,
//     description,
//     otherInfo,
//     image,
//     status,
//     dateLastSeen,
//     locationLastSeen,
//   } = req.body;

//   let user;
//   let newPet;

//   let locationLastSeenDoc;

//   let coords;
//   console.log("locationLastSeen:", locationLastSeen);
//   try {
//     let sess = await mongoose.startSession();
//     await sess.startTransaction();

//     try {
//       if (typeof locationLastSeen.lat === "number" && typeof locationLastSeen.lon === "number") {
//         coords = [locationLastSeen.lat, locationLastSeen.lon];
//       } else {
//         coords = [0, 0];
//       }

//       if (!coords) {
//         throw new Error("Invalid coordinates");
//       }
//       console.log('check:' + coords)
//       locationLastSeenDoc = new Location({
//         status: status,
//         location: {
//           type: "Point",
//           coordinates: coords,
//         },
//       });
//       await locationLastSeenDoc.save({ session: sess });
//     } catch (err) {
//       const error = new HttpError("failed to set coords", 500);
//       res.json({ msg: error.message });
//       return next(err);
//     }

//     newPet = await new Pet({
//       userId,
//       petId: petId,
//       petName,
//       age,
//       description,
//       otherInfo,
//       image: `https://res.cloudinary.com/daxrovkug/image/upload/v1746460136/ktApp-petMainPic/${petId}.jpg`,
//       status,
//       dateLastSeen,
//       locationLastSeen: locationLastSeenDoc._id,
//     });

//     await newPet.save({ session: sess });

//     try {
//       user = await User.findOne({ userId });

//       if (!user) {
//         res.json({ msg: "User Not Found" });
//       } else {
//         await user.pets.push(newPet);
//         await user.save({ session: sess });
//         await sess.commitTransaction();
//         console.log("WORKING??:" + newPet);
//         res.json(newPet);
//       }
//     } catch (err) {
//       const error = new HttpError("Error Adding Pet, please try again!", 500);
//       res.json({ msg: error.message });
//       return next(error);
//     }
//   } catch (err) {
//     const error = new HttpError("Unexpected Error", 500);
//     res.json({ msg: error.message });
//     return next(error);
//   }
// };

// const getPetsByUserId = async (req, res, next) => {
//   const userId = req.params.userId;
//   let user;
//   let pets;

//   try {
//     pets = await User.findOne({ userId }).populate("pets");

//     if (pets == null) {
//       const error = new HttpError("No pets found", 500);
//       res.json({ msg: error.message });
//       return next(error);
//     }
//     res.json(pets.pets);
//   } catch (err) {
//     const error = new HttpError("Unable to find user", 500);
//     res.json({ msg: error.message });
//     return next(error);
//   }
// };

// const uploadPhoto = async (req, res, next) => {
//   if (!req.file) {
//     const error = new HttpError("No file uploaded", 400);
//     res.json({ msg: error.message });
//     return next(error);
//   }

//   res.json({
//     msg: "File uploaded successfully",
//     fileUrl: req.file.path, // Cloudinary URL
//   });
// };

// const getAllLostPets = async (req, res, next) => {
//   let allLostPets;
//   try {
//     allLostPets = (await Pet.find({ status: "missing" }).populate("locationLastSeen"))

//     if (allLostPets.length === 0) {
//       const error = new HttpError(
//         "No lost pets found, try restarting app",
//         404
//       );
//       res.json({ msg: error.message });
//       return next(error);
//     }
//   } catch (err) {
//     const error = new HttpError("Could Not retreive List", 500);
//     res.json({ msg: error.message });
//     return next(error);
//   }
//   return res.json(allLostPets);
// };

// const deletePetById = async (req, res, next) => {
//   const petId = req.params.petId;
//   let pet;

//   try {
//     pet = await Pet.findOneAndDelete({ petId: petId });
//     if (!pet) {
//       const error = new HttpError("Pet Not Found", 404);
//       res.json({ msg: error.message });
//       return next(error);
//     }
//   } catch (err) {
//     const error = new HttpError("Error Deleting Pet", 500);
//     res.json({ msg: error.message });
//     return next(error);
//   }

//   res.json({ msg: "Pet Deleted Successfully", petId: pet.petId });
// };

// const updatePetById = async (req, res, next) => {
//   console.log("pet req.body:", req.body);
//   const petIdParam = req.params.petId;
//   const {
//     userId,
//     petId,
//     petName,
//     age,
//     description,
//     otherInfo,
//     image,
//     status,
//     dateLastSeen,
//     locationLastSeen,
//   } = req.body;

//   let coords;
//   try {
//     coords = [locationLastSeen.lat, locationLastSeen.lon];
//   } catch (err) {
//     const error = new HttpError("failed to set coords", 500);
//     res.json({ msg: error.message });
//     return next(error);
//   }
//   try {
//     let pet = await Pet.findOneAndUpdate(
//       { petId: petIdParam },
//       { $set: { description, otherInfo, status, locationLastSeen: coords } }
//     );
//     if (!pet) {
//       const error = new HttpError("Pet Not Found", 404);
//       res.json({ msg: error.message });
//       return next(error);
//     }
//     return res.json(pet);
//   } catch (err) {
//     const error = new HttpError("Error Updating Pet", 500);
//     res.json({ msg: error.message });
//     return next(err);
//   }
// };

// TEST METHOD -----------------------------------------------------------------------
const deleteAllPets = async (req, res, next) => {
  console.log("running delete");
  try {
    await Pet.deleteMany({});
    res.send("deleted succesfully");
  } catch (err) {
    res.send(err);
  }
};

export {
//   addNewPet,
  // getPetsByUserId,
  // uploadPhoto,
  // getAllLostPets,
  // deletePetById,
  // updatePetById,
  // TEMP
  deleteAllPets,
};
