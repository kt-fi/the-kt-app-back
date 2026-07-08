import { Resend } from 'resend';
import { uuid } from 'uuidv4';
import ResetPasswordToken from '../../schemas/resetPasswordTokenSchema.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const passwordResetEmail = async (req, res, next) => {


  let token = uuid();

  console.log(token);

  try {
  
    let resetPasswordToken = await new ResetPasswordToken({
      userId: '69f1f8f14c83e279035fd748', // Replace with the actual user ID
      token: token,
    });
    await resetPasswordToken.save();

const { data } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'kt-five@hotmail.com',
  replyTo:  'onboarding@resend.dev',
  subject: 'hello world',
  html: '<strong>it works!</strong>',
});

    console.log(data);
    return res.json({ message: 'Password reset email sent successfully', resetPasswordToken });
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return res.status(500).json({ message: 'Failed to send password reset email' });
  }
};

export default passwordResetEmail;  