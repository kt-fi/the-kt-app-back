const express = require('express');
const authController = require('../controllers/authController')
const { verifyToken } = require('../verifyJWT');
const router = express.Router();


router.post('/auth/google',   authController.loginGoogle);
router.post('/auth/signupEmail', authController.signupEmail);
router.post('/auth/loginEmail', authController.loginEmail)

module.exports = router;