const { uuid } = require('uuidv4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema');
const HttpError = require('../httpError')


const loginGoogle = async ( req, res, next )  =>{
    let newUser =  req.body ;
    let user;
  

    try{
        let userExists
        userExists = await User.findOne({email: newUser.email})
       
       if(userExists) {
        try {
             user = userExists;
        }catch(err){
            const error = new HttpError('Failed To Find User', 500)
            return res.send(error)
        }
      
       }else {
        try {
            user = await new User({
                    userId: uuid(),
                    userName: newUser.name,
                    email: newUser.email,
        })
            user.save()
        }catch(err){
            const error = new HttpError('Failed To Save New User', 500)
            return res.send(error)
        }
       }
    }catch(err) {
        const error = new HttpError('Failed To Save New User', 400)
        return res.send(error)
    }
     
    try {
        let payload = { subject: user._id};
        let token = jwt.sign(payload, process.env.JWT_SECRET);
         res.json({user, token})
    }catch(err){
        console.log(err)
        const error = new HttpError('Error Creating JWT', 500)
        return res.send(error)
    }
}


const loginEmail = async ( req, res, next ) => {
    let { userName, email, password }= req.body;
    let user;
    let saltRounds = 10;
    let passwordHashed;
    try {
        let userExists = await User.findOne({email});
        if(userExists){
            res.json({msg: 'User Already Exists, Please Try again with another email.'});
            return;
        }else{
            try{
                passwordHashed = await bcrypt.hash(password, saltRounds)

        user = await new User({
            userId: uuid(),
            userName,
            email,
            password: passwordHashed
        });

        user.save();

            }catch(err){
                res.json({msg: 'User Already Exists, Please Try again with another email.'});
                return;
            }
        }

    }catch(err){
        console.log(err)
        const error = new HttpError('Failed To Save New User', 500)
        return res.send(error)
    }

    try {
        let payload = { subject: user._id};
        let token = jwt.sign(payload, process.env.JWT_SECRET);
         res.json({user, token})
    }catch(err){
        const error = new HttpError('Error Creating JWT', 500)
        return res.send(error)
    }
    

}


 exports.loginGoogle = loginGoogle;
 exports.loginEmail = loginEmail;