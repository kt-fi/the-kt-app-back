import User from "../../schemas/userSchema.js";
import jwt from "jsonwebtoken";

const checkLoginWithJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: "Unauthorized Request: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized Request: Invalid token format" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: "Unauthorized Request: Invalid token" });
    }

    const userId = decoded.subject;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
};

export default checkLoginWithJWT;