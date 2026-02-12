import Pet from "../../schemas/petSchema.js";
import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";
import Location from "../../schemas/locationSchema.js";
import Message from "../../schemas/messageSchema.js";
import Chat from "../../schemas/chatSchema.js";
import mongoose from "mongoose";
import e from "express";

export { default as addNewPet } from './addNewPet.js';
export { default as getPetsByUserId } from './getPetsByUserId.js';

export { default as getSpottedLocationsList } from './getSpottedLocationsList.js';
// 
export { default as getAllLostPets } from './getAllLostPets.js';
export { default as deletePetById } from './deletePetById.js';
export { default as updatePetById } from './updatePetById.js';
export { default as getPetById } from './getPetById.js';

// TEST METHOD -----------------------------------------------------------------------

const uploadPhoto = async (req, res, next) => {

  if (!req.file) {
    const error = new HttpError("No file uploaded", 400);
    return res.status(400).json({ msg: error.message });
  }

  res.json({
    msg: "File uploaded successfully",
    fileUrl: req.file.path, // Cloudinary URL
  });
};



const getAllUsers = async (req, res, next) => {
  let users;  
  try {
    users = await User.find({}, '-password'); // Exclude password field
  } catch (err) {
    const error = new HttpError("Fetching users failed, please try again later.", 500);
    return res.status(500).json({ msg: error.message });
  }
  res.json(users);
};


const deleteAllPets = async (req, res, next) => {
  try {
    await Pet.deleteMany({});
    await User.deleteMany({});
    await Location.deleteMany({});
    await Message.deleteMany({});
    await Chat.deleteMany({});

    res.json({ msg: "Deleted Database successfully" });
  } catch (err) {
    const error = new HttpError("Error deleting pets", 500);
    return res.status(500).json({ msg: error.message });
  }
};

export { deleteAllPets, uploadPhoto, getAllUsers };