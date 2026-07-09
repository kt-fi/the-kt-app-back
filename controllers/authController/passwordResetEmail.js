import { Resend } from "resend";
import { uuid } from "uuidv4";
import ResetPasswordToken from "../../schemas/resetPasswordTokenSchema.js";
import User from "../../schemas/userSchema.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const passwordResetEmail = async (req, res, next) => {

  let token = uuid();
  let userId = req.body.userId; // Assuming the user ID is sent in the request body
  let user;
  let tokenExists;

  console.log(token);

  try {

    
    user = await User.findOne({ _id: userId });

    tokenExists = await ResetPasswordToken.findOne({ userId: userId });

    if (tokenExists) {
      await ResetPasswordToken.deleteOne({ userId: userId });
      // res.json({ message: "Existing token deleted. A new token will be created." });
    }

    let resetPasswordToken = await new ResetPasswordToken({
      userId: userId,
      token: token,
    });
    await resetPasswordToken.save();


    const { data } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      replyTo: "onboarding@resend.dev",
      subject: "Reset Password",
      html: `<strong>Reset your password, click this link</strong> <br> <a href=${process.env.WEB_APP_URL}/reset-password/token'>Reset Password</a>`,
    });

    console.log(data);
    return res.json({
      message: "Password reset email sent successfully",
      resetPasswordToken,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return res
      .status(500)
      .json({ message: "Failed to send password reset email" });
  }
};

export default passwordResetEmail;
