import { uuid } from 'uuidv4';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schemas/userSchema.js';
import HttpError from '../httpError.js';
import { validationResult } from 'express-validator';





const loginGoogle = async (req, res, next) => {
  let newUser = req.body;
  let user;
  try {
    let userExists;
    userExists = await User.findOne({ email: newUser.email });

    if (userExists) {
      try {
        user = userExists;
      } catch (err) {
        const error = new HttpError("Undefined Error Occured", 500);
        res.json({ msg: error.message });
        return next(error);
      }
    } else {
      try {
        user = await new User({
          userId: uuid(),
          userName: newUser.name,
          email: newUser.email,
          pets: [],
        });
        user.save();
      } catch (err) {
        const error = new HttpError("Failed To Save New User", 500);
        res.json({ msg: error.message });
        return next(error);
      }
    }
  } catch (err) {
    const error = new HttpError("Failed To Save New User", 400);
    res.json({ msg: error.message });
    return next(error);
  }

  try {
    let payload = { subject: user._id };
    let token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Error Creating JWT", 500);
    res.json({ msg: error.message });
    return next(error);
  }
};

const signupEmail = async (req, res, next) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.json({msg: "There is an error(s) in your form, please check and try again",})
      .status(422);
  }

  let { userName, email, password, telephone } = req.body;
  let user;
  let saltRounds = 10;
  let passwordHashed;

  

  try {
    let userExists = await User.findOne({ email });
    if (userExists) {
      const error = new HttpError(
        "User Already Exists, Please Try again with another Email address",
        500
      );
      res.json({ msg: error.message });
      return next(error);
    } else {
      try {
        passwordHashed = await bcrypt.hash(password, saltRounds);

        user = await new User({
          userId: uuid(),
          userName,
          email,
          password: passwordHashed,
          telephone,
          pets: [],
        });

        user.save();
      } catch (err) {
        const error = new HttpError("An Error has occured and user could not be created, please try again!!", 500);
        console.log(err)
        res.json({ msg: error.message });
        return next(error);
      }
    }
  } catch (err) {
    const error = new HttpError("An Error has occured and user could not be created, please try again!!", 500);
    console.log(err)
    res.json({ msg: error.message });
    return next(error);
  }

  try {
    let payload = { subject: user._id };
    let token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    const error = new HttpError("Error Creating Token", 500);
    res.json({ msg: error.message });
    return next(error);
  }
};

const loginEmail = async (req, res, next) => {
  let { email, password } = req.body;
  let user;
  let checkPassword;
  let token;



  try {
    user = await User.findOne({ email: email });

    if (!user) {
      res.json({ msg: "No User matches email address, please sign up" });
      return;
    }
    try {
      checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        const error = new HttpError(
          "Password or email incorrect, please try again",
          500
        );
        res.json({ msg: error.message });
        return next(error);
      }
    } catch (err) {
      const error = new HttpError(
        "Password or email incorrect, please try again",
        500
      );
      res.json({ msg: error.message });
      return next(error);
    }
    try {
      if (checkPassword == true) {
        try {
          let payload = { subject: user._id };
          token = jwt.sign(payload, process.env.JWT_SECRET);
         
        } catch (err) {
          const error = new HttpError("Error Creating JWT", 500);
          res.json({ msg: error.message });
          return next(error);
        }
      } else {
        const error = new HttpError(
          "A problem occured logging in, please check credentials and try again",
          500
        );
        res.json({ msg: error.message });
        return next(error.message);
      }
    } catch (err) {
      const error = new HttpError("Unknown Server Error", 500);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Unknown Server Error", 500);
    return next(error);
  }
  res.json({ user, token });
};

const checkLoginWithJWT = async (req, res, next) => {
  let userId;
  let user;
  try {
    
    let token = req.headers.authorization.split(" ")[1];
    if (token === null) {
      return res.status(401).send("Unautorized Request");
    } else {
      jwt.verify(token, process.env.JWT_SECRET, (err, foundUserId) => {
        if (err) {
          return res.status(401).send("Unautorized Request4");
        }
        userId = foundUserId.subject;
      });
    }
  } catch (err) {
    console.log("Couldnt Find Token");
  }

  if (userId) {
    try {
      user = await User.findOne({ _id: userId });
      return res.json(user);
    } catch (err) {
      console.log(err);
    }
  }
};




const getLocation = async (req, res) => {
  try {
    const { lat, lon } = req.params;
    console.log(lat)

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    // Use global fetch in Node 20
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Katie-App (katie5five.5@gmail.com)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error('Error fetching location:', err);
    res.status(500).json({ error: err.message });
  }
};



  
  




export { 
  loginGoogle, 
  signupEmail, 
  loginEmail, 
  checkLoginWithJWT, 
  getLocation 
};