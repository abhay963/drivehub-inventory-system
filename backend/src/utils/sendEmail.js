import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Car Dealership Inventory" <${process.env.EMAIL_USER}>`,
      to: email,
      replyTo: process.env.EMAIL_USER,
      subject: "Verify Your Email",
      text: `Your verification code is ${otp}. It is valid for 5 minutes.`,

      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification</title>

<style>
@keyframes fadeIn{
from{opacity:0;transform:translateY(18px);}
to{opacity:1;transform:translateY(0);}
}
@keyframes glow{
0%,100%{
box-shadow:0 0 0 0 rgba(79,70,229,.45),
0 8px 25px rgba(79,70,229,.25);
}
50%{
box-shadow:0 0 0 10px rgba(79,70,229,0),
0 12px 35px rgba(79,70,229,.35);
}
}
@keyframes pulse{
0%,100%{transform:scale(1);}
50%{transform:scale(1.03);}
}
</style>

</head>

<body style="margin:0;padding:0;background:#f0f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
Your verification code is ${otp}. Valid for 5 minutes.
</div>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0f4ff;padding:40px 16px;">
<tr>
<td align="center">

<table width="100%" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 50px rgba(79,70,229,.12);">

<tr>
<td style="background:linear-gradient(135deg,#4f46e5,#7c3aed,#2563eb);padding:42px 32px;text-align:center;">

<div style="
width:72px;
height:72px;
background:rgba(255,255,255,.18);
border:2px solid rgba(255,255,255,.35);
border-radius:20px;
margin:0 auto 18px;
display:flex;
align-items:center;
justify-content:center;
font-size:36px;
">
🚗
</div>

<h1 style="margin:0;font-size:26px;color:#fff;">
Car Dealership Inventory
</h1>

<p style="margin-top:8px;color:rgba(255,255,255,.9);">
Email Verification
</p>

</td>
</tr>

<tr>
<td style="padding:42px 36px;text-align:center;">

<h2 style="margin:0;color:#111827;">
Verify your email address
</h2>

<p style="margin:18px 0 32px;color:#6b7280;line-height:1.7;">
Welcome aboard! Use the one-time code below to complete your registration.
<br>
This code is valid for
<strong style="color:#4f46e5;">5 minutes</strong>.
</p>

<div style="
display:inline-block;
background:linear-gradient(135deg,#4f46e5,#2563eb);
color:#fff;
padding:20px 48px;
border-radius:18px;
font-size:38px;
font-weight:800;
letter-spacing:12px;
font-family:Consolas,Monaco,monospace;
">
${otp}
</div>

<div style="
margin-top:36px;
background:#f0f4ff;
border:1px solid #e0e7ff;
border-radius:16px;
padding:18px;
text-align:left;
">

<p style="margin:0;color:#374151;line-height:1.7;">
🔒 <strong>Security Tip:</strong><br>
Never share this verification code with anyone.
If you didn't request this email, you can safely ignore it.
</p>

</div>

</td>
</tr>

<tr>
<td style="
background:#f8fafc;
padding:28px;
text-align:center;
border-top:1px solid #e5e7eb;
">

<p style="margin:0;color:#6b7280;">
Need help? Contact our support team anytime.
</p>

<p style="margin-top:10px;font-size:12px;color:#9ca3af;">
© ${new Date().getFullYear()} Car Dealership Inventory System
<br>
Built with ❤️ for a secure experience.
</p>

</td>
</tr>

</table>

<p style="margin-top:28px;font-size:12px;color:#94a3b8;">
This is an automated message — please do not reply.
</p>

</td>
</tr>
</table>

</body>
</html>
`,
    });

    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
};