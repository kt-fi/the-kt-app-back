import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginEmail = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new HttpError("No user matches email address, please sign up", 404);
      res.status(404).json({ msg: error.message });
      return next(error);
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      const error = new HttpError("Password or email incorrect, please try again", 401);
      res.status(401).json({ msg: error.message });
      return next(error);
    }

    let payload = { subject: user._id };
    let token;
    try {
      token = jwt.sign(payload, process.env.JWT_SECRET);
    } catch (err) {
      const error = new HttpError("Error Creating JWT", 500);
      res.status(500).json({ msg: error.message });
      return next(error);
    }

    res.json({ user, token });
  } catch (err) {
    const error = new HttpError("Unknown Server Error", 500);
    res.status(500).json({ msg: error.message });
    return next(error);
  }
};

export default loginEmail;