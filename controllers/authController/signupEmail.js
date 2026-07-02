import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";
import ErrorLogMessage from "../../schemas/errorLogMessageSchema.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";


const signupEmail = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("There is an error(s) in your form, please check and try again", 422);
    return res.status(422).json({ msg: error.message, errors: errors.array() });
  }

  console.log("Request Body:", req.body);

  const { userName, email, password, telephone, accountType } = req.body;
  let user;
  const saltRounds = 10;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new HttpError(
        "User Already Exists, Please Try again with another Email address",
        409
      );
      return res.status(409).json({ msg: error.message });

    }

    const passwordHashed = await bcrypt.hash(password, saltRounds);

    user = new User({
      userName,
      email,
      password: passwordHashed,
      telephone,
      pets: [],
      accountType: accountType != null && accountType !== undefined ? accountType : "free",
    });

    await user.save();

    const payload = { subject: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ user, token });
  } catch (err) {
    const errorLog = new ErrorLogMessage({
      message: err.message,
      component: "signup email controller",
      level: "error",
      timestamp: new Date(),
      notes: null,
      currentSatus: "new",
    });
    await errorLog.save();
    const error = new HttpError("An Error has occurred and user could not be created, please try again!", 500);
    return res.status(500).json({ msg: error.message });
  }
};

export default signupEmail;