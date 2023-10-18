const Pet = require('../schemas/petSchema');
const User = require('../schemas/userSchema');
const HttpError = require('../httpError');
const { uuid } = require('uuidv4');
const mongoose = require('mongoose')
const { validationResult } = require('express-validator')

const addNewPet = async (req, res, next) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        // return res.json({msg:"errors exist in your sign up form please check all required inpts"}).status(422)
        let error = new HttpError('Not Correct', 400)
        return next(error)
     }

   const { userId, petName, age, description, otherInfo, image, status } = req.body;
   
   let user;
   let newPet;

   try {
        newPet = await new Pet({
            userId,
            petId: uuid(),
            petName,
            age,
            description,
            otherInfo,
            image,
            status
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

                res.json(newPet)
            }
        }catch(err){
            const error = new HttpError('Error adding Pet to user', 500);
            res.json({msg: error.message});
            return next(error) 
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



// TEST METHOD -----------------------------------------------------------------------

const getAllPets = async (req, res, next) => {
    let allPets;
    try {
        allPets = await Pet.find({})
    } catch(err) {
        const error = new HttpError('Could Not retreive List', 500)
        res.json({msg: error.message});
        return next(error)
    }
    return res.json(allPets)
}


const deleteAllPets = async (req, res, next) => {
    console.log('running delete')
    try {
        await Pet.deleteMany({})
        res.send('deleted succesfully')
    }catch(err) {
        res.send(err)
    }
}

exports.addNewPet = addNewPet;
exports.getPetsByUserId = getPetsByUserId;

exports.deleteAllPets = deleteAllPets;
exports.getAllPets = getAllPets;