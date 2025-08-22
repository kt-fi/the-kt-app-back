import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const signupEmail = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("There is an error(s) in your form, please check and try again", 422);
    res.status(422).json({ msg: error.message, errors: errors.array() });
    return next(error);
  }

  const { userName, email, password, telephone } = req.body;
  let user;
  const saltRounds = 10;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new HttpError(
        "User Already Exists, Please Try again with another Email address",
        409
      );
      res.status(409).json({ msg: error.message });
      return next(error);
    }

    const passwordHashed = await bcrypt.hash(password, saltRounds);

    user = new User({
      userId: uuid(),
      userName,
      email,
      password: passwordHashed,
      telephone,
      pets: [],
    });

    await user.save();

    const payload = { subject: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ user, token });
  } catch (err) {
    const error = new HttpError("An Error has occurred and user could not be created, please try again!", 500);
    res.status(500).json({ msg: error.message });
    return next(error);
  }
};

export default signupEmail;