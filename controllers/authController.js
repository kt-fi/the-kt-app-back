const { uuid } = require('uuidv4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema');
const HttpError = require('../httpError')
const { validationResult } = require('express-validator');


const loginGoogle = async ( req, res, next )  =>{
    let newUser =  req.body ;
    let user;
  

    try{
        let userExists;
        userExists = await User.findOne({email: newUser.email})
       
       if(userExists) {
        try {
             user = userExists;
        }catch(err){
            const error = new HttpError('Failed To Find User', 500)
            res.json({msg: error.message});
            return next(error)
        }
      
       }else {
        try {
            user = await new User({
                    userId: uuid(),
                    userName: newUser.name,
                    email: newUser.email,
                    pets: []
        })
            user.save();
        }catch(err){
            const error = new HttpError('Failed To Save New User', 500)
            res.json({msg: error.message});
            return next(error);
        }
       }
    }catch(err) {
        const error = new HttpError('Failed To Save New User', 400)
        res.json({msg: error.message});
        return next(error);
    }
     
    try {
        let payload = { subject: user._id};
        let token = jwt.sign(payload, process.env.JWT_SECRET);
         res.json({user, token})
    }catch(err){
        console.log(err)
        const error = new HttpError('Error Creating JWT', 500)
        return next(error)
    }
}


const signupEmail = async ( req, res, next ) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors)
        return res.json({msg:"errors exist in your sign up form please check all required inpts"}).status(422)
     }

    let { userName, email, password } = req.body;
    let user;
    let saltRounds = 10;
    let passwordHashed;

    try {
        let userExists = await User.findOne({email});
        if(userExists){
            const error = new HttpError('User Already Exists, Please Try again with another email', 500)
            res.json({msg: error.message});
            return  next(error)

        }else{
            try{
                passwordHashed = await bcrypt.hash(password, saltRounds)

        user = await new User({
            userId: uuid(),
            userName,
            email,
            password: passwordHashed,
            pets: []
        });

        user.save();

            }catch(err){
                const error = new HttpError('Failed To Save New User', 500)
                res.json({msg: error.message});
                return next(error)
            }
        }

    }catch(err){
        console.log(err)
        const error = new HttpError('Failed To Save New User', 500)
        res.json({msg: error.message});
        return next(error)
    }

    try {
        let payload = { subject: user._id};
        let token = jwt.sign(payload, process.env.JWT_SECRET);
         res.json({user, token})
    }catch(err){
        const error = new HttpError('Error Creating JWT', 500)
            res.json({msg: error.message});
            return next(error)
    }
}

const loginEmail = async (req, res, next) => {
    let userData = req.body;
    let foundUser;
    let checkPassword
    try {
        foundUser = await User.findOne({email: userData.email});
   
        if(!foundUser){
             res.json({msg: 'No User matches email address, please sign up'})
             return;
        }
        try {
            checkPassword = await bcrypt.compare(userData.password, foundUser.password)

            if(!checkPassword) {
                const error = new HttpError('Password or email incorrect, please try again', 500)
                res.json({msg: error.message});
                return  next(error)
            }
        }catch(err){
            const error = new HttpError('Password or email incorrect, please try again', 500)
            res.json({msg: error.message});
            return  next(error)
        }
        try {
            if(checkPassword == true){

                try {
                    let payload = { subject: foundUser._id};
                    let token = jwt.sign(payload, process.env.JWT_SECRET);
                     res.json({foundUser, token})
                }catch(err){
                    const error = new HttpError('Error Creating JWT', 500)
                    res.json({msg: error.message});
                    return next(error)
                }
            //  return res.json(foundUser)
        }else{
            const error = new HttpError('A problem occured logging in, please check credentials and try again', 500)
            res.json({msg: error.message});
            return next(error.message)
        }
        }catch(err){
            const error = new HttpError('Unknown Server Error', 500)
            return next(error)
        }
    }catch(err){
        const error = new HttpError('Unknown Server Error', 500)
        return next(error)
    }
}

const checkLoginWithJWT = async ( req, res, next ) => {

    let userId;
    let user;
try {
    let token = req.headers.authorization.split(' ')[1];
    if(token === null) {
        return res.status(401).send('Unautorized Request')
    } else{
          jwt.verify(token, process.env.JWT_SECRET, (err, foundUserId) => {
        if(err){
            return res.status(401).send('Unautorized Request4')
        }
        userId = foundUserId.subject;
    });
    }
  
}catch(err){
    console.log(err)
}

if(userId){
    try {
    user = await User.findOne({_id: userId})
    return res.json(user)
}catch(err){
    console.log(err)
}
}


   
}

 exports.loginGoogle = loginGoogle;
 exports.signupEmail = signupEmail;
 exports.loginEmail = loginEmail;
 exports.checkLoginWithJWT = checkLoginWithJWT;