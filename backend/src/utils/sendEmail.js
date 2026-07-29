import nodemailer from "nodemailer";

const createTransporter = () => {

  // 👇 Add here
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendOtpEmail = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Your OTP</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};