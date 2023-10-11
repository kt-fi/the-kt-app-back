const express = require('express');
const authController = require('../controllers/authController')
const { verifyToken } = require('../verifyJWT');
const router = express.Router();


router.post('/auth/google',   authController.loginGoogle);
router.post('/auth/email', authController.loginEmail);


module.exports = router;