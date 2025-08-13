import Pet from '../schemas/petSchema.js';
import User from '../schemas/userSchema.js';
import HttpError from '../httpError.js';
import { uuid } from 'uuidv4';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import cloudinary from '../utils/cloudinary.js';

const addNewPet = async (req, res, next) => {
    // let errors = validationResult(req);

    // if(!errors.isEmpty()){
    //     let error = new HttpError(errors)
    //     console.log(errors)
    //     res.json({msg: error.message}).status(422)
    //     return next(error)
    //  }

   const { userId, petId, petName, age, description, otherInfo, image, status, dateLastSeen, locationLastSeen } = req.body;

   let user;
   let newPet;
   let randomId = uuid();

   try {
        newPet = await new Pet({
            userId,
            petId: petId,
            petName,
            age,
            description,
            otherInfo,
            image: `https://res.cloudinary.com/daxrovkug/image/upload/v1746460136/ktApp-petMainPic/${petId}.jpg`,
            status,
            dateLastSeen,
            locationLastSeen: [locationLastSeen.lat, locationLastSeen.lon]
        })
        

        try {
            user = await User.findOne({userId})
              
            if(!user) {
                res.json({msg: 'User Not Found'})
            }else{
                let sess = await mongoose.startSession();
                await sess.startTransaction();
                await newPet.save({session: sess});
                await user.pets.push(newPet);
                await user.save();
                await sess.commitTransaction();
                console.log(newPet)
                res.json(newPet)
            }
        }catch(err){
            const error = new HttpError('Error Adding Pet, please try again!', 500);
            res.json({msg: error.message});
            return next(err) 
        }
   } catch(err) {
        const error = new HttpError('Unexpected Error', 500);
        res.json({msg: error.message});
        return next(error)
   }
}


const getPetsByUserId = async (req, res, next) => {

    const userId = req.params.userId;
    let user;
    let pets;

    try {
        pets = await User.findOne({userId}).populate('pets');
        res.json(pets.pets)

    }catch(err) {
        const error = new HttpError('Unable to find user', 500)
        res.json({msg: error.message});
        return next(error)
    }
}

const uploadPhoto = async (req, res, next) => {
    if (!req.file) {
        console.error("No file received");
        return res.status(400).json({ msg: "No file uploaded" });
      }
      console.log("File uploaded successfully:", req.file);
      res.json({
        msg: "File uploaded successfully",
        fileUrl: req.file.path, // Cloudinary URL
      });
}

const updatePetInfo = async ( req, res, next ) => {
 // ADD UPDATE CODE
}




const getAllLostPets = async (req, res, next) => {
    let allLostPets;
    try {
        allLostPets = await Pet.find({status: 'missing'})
    } catch(err) {
        const error = new HttpError('Could Not retreive List', 500)
        res.json({msg: error.message});
        return next(error)
    }
    return res.json(allLostPets)
}

const deletePetById = async (req, res, next) => {
    const petId = req.params.petId;
    let pet;

    try {
        pet = await Pet.findOneAndDelete({petId: petId});
        if(!pet) {
            const error = new HttpError('Pet Not Found', 404);
            res.json({msg: error.message});
            return next(error)
        }
    } catch(err) {
        const error = new HttpError('Error Deleting Pet', 500);
        res.json({msg: error.message});
        return next(error)
    }

    res.json({msg: 'Pet Deleted Successfully', petId: pet.petId});
}

const updatePetById = async (req, res, next) => {
//UPDATE LOGIC HERE
}



// TEST METHOD -----------------------------------------------------------------------
const deleteAllPets = async (req, res, next) => {
    console.log('running delete')
    try {
        await Pet.deleteMany({})
        res.send('deleted succesfully')
    }catch(err) {
        res.send(err)
    }
}

export { 
  addNewPet,
  getPetsByUserId,
  updatePetInfo,
  uploadPhoto,
  getAllLostPets,
  deletePetById,
  updatePetById,
  // TEMP
  deleteAllPets
};