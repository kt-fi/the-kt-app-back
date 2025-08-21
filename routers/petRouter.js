import express from 'express';
import * as petController from '../controllers/petController/petController.js';
const router = express.Router();
import { check } from 'express-validator';
import verifyToken from '../verifyJWT.js';
import upload from '../utils/multerConfig.js';

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

router.delete('/deletePetById/:petId',
     verifyToken, 
     petController.deletePetById)

router.put('/updatePetById/:petId',
    //  verifyToken,
      petController.updatePetById,
    check('petName').notEmpty().isLength({min: 3}),
    check('age').isNumeric().notEmpty(),
    check('description').notEmpty().isLength({min:10}),)    

router.delete('/deleteAllPets', petController.deleteAllPets)

export default router;

