const express = require('express');
const authController = require('../controllers/authController')
const { check } = require('express-validator')
const router = express.Router();


router.post('/auth/google', authController.loginGoogle);

router.post('/auth/signupEmail', 
check('userName').notEmpty().isLength({min: 5}),
check('email').notEmpty().isEmail(),
check('password').notEmpty().isLength({min:6}),
authController.signupEmail);

router.post('/auth/loginEmail', 
check('email').isEmail(), 
check('password').isLength({min:6}),
 authController.loginEmail)

 router.get('/auth/checkLoginWithJWT', authController.checkLoginWithJWT)

module.exports = router;