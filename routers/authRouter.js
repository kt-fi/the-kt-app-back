const express = require('express');
const authController = require('../controllers/authController')
const { check } = require('express-validator')
const router = express.Router();


router.post('/auth/google', authController.loginGoogle);

router.post('/auth/signupEmail', 
check('userName').notEmpty().isLength({min: 3}),
check('email').notEmpty().isEmail(),
check('password').notEmpty().isLength({min:6}),
authController.signupEmail);

router.post('/auth/loginEmail', 
check('email').isEmail(), 
check('password').isLength({min:6}),
authController.loginEmail)

router.get('/auth/checkLoginWithJWT', authController.checkLoginWithJWT)

router.get('/api/location/:lat/:lon', authController.getLocation);

module.exports = router;