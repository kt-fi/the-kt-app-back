const petController = require('../controllers/petController');
const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { verifyToken } = require('../verifyJWT')

const upload = require("../utils/multerConfig");

router.post('/uploadPhoto', upload.single('image'), petController.uploadPhoto)

router.post('/newPet', verifyToken,
    check('petName').notEmpty().isLength({min: 3}),
    check('age').isNumeric({max:30}).notEmpty(),
    check('description').notEmpty().isLength({min:10}),
    petController.addNewPet);
router.get('/getPetsByUserId/:userId', verifyToken, petController.getPetsByUserId)
router.get('/getAllLostPets', 
    // verifyToken,
     petController.getAllLostPets)

router.get('/updatePetInfo', verifyToken, petController.updatePetInfo, 
    check('petName').notEmpty().isLength({min: 3}),
    check('age').isNumeric().notEmpty(),
    check('description').notEmpty().isLength({min:10}),)

router.delete('/deletePetById/:petId',
    //  verifyToken, 
     petController.deletePetById)

router.delete('/updatePetById/:petId', verifyToken, petController.updatePetById,
    check('petName').notEmpty().isLength({min: 3}),
    check('age').isNumeric().notEmpty(),
    check('description').notEmpty().isLength({min:10}),)    

router.delete('/deleteAllPets', petController.deleteAllPets)

module.exports = router;

