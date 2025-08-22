import User from "../../schemas/userSchema.js";
import jwt from "jsonwebtoken";

const checkLoginWithJWT = async (req, res, next) => {
  let userId;
  let user;
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "Unauthorized Request: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized Request: Invalid token format" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, foundUserId) => {
      if (err) {
        return res.status(401).json({ msg: "Unauthorized Request: Invalid token" });
      }
      userId = foundUserId.subject;
    });
  } catch (err) {
    return res.status(401).json({ msg: "Unauthorized Request: Could not find token" });
  }

  if (userId) {
    try {
      user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: "Server error" });
    }
  } else {
    return res.status(401).json({ msg: "Unauthorized Request: No userId found" });
  }
};

export default checkLoginWithJWT;