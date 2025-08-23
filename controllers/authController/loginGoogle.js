import User from "../../schemas/userSchema.js";
import HttpError from "../../httpError.js";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const loginGoogle = async (req, res, next) => {
  const newUser = req.body;
  let user;

  try {
    user = await User.findOne({ email: newUser.email });

    if (!user) {
      user = new User({
        userId: uuid(),
        userName: newUser.name,
        email: newUser.email,
        pets: [],
      });
      await user.save();
    }
  } catch (err) {
    const error = new HttpError("Failed to find or save user", 500);
    return res.status(500).json({ msg: error.message });
  }

  try {
    const payload = { subject: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    const error = new HttpError("Error Creating JWT", 500);
    return res.status(500).json({ msg: error.message });
  }
};

export default loginGoogle;