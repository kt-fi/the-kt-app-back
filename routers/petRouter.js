const petController = require('../controllers/petController');
const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const { verifyToken } = require('../verifyJWT')


router.post('/newPet', verifyToken,
check('petName').notEmpty().isLength({min: 3}),
check('age').isNumeric().notEmpty(),
check('description').notEmpty().isLength({min:10}),
petController.addNewPet);
router.get('/getPetsByUserId/:userId', verifyToken, petController.getPetsByUserId)
router.get('/getAllPets', verifyToken, petController.getAllPets)

router.delete('/deleteAllPets', petController.deleteAllPets)

module.exports = router;

