import User from "../../schemas/userSchema.js";
import ResetPasswordToken from "../../schemas/resetPasswordTokenSchema.js";
import bcrypt from "bcryptjs";

const passwordResetForm = async (req, res) => {
  let user;
  let tokenData;

  const { token, newPassword } = req.body; // Get the data from the request body


  try {
    tokenData = await ResetPasswordToken.findOne({ token: token });

    if (!tokenData) {
      return res.status(400).send("Invalid token");
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user = await User.findOne({ _id: tokenData.userId });
    

    if (!user) {
      return res.status(404).send("User not found");
    }

    await ResetPasswordToken.deleteOne({ token: token });
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Error fetching token data:", err);
    res.status(500).send("Internal server error");
  }
};

export default passwordResetForm;
