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
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:40px 15px;">
<tr>
<td align="center">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
style="max-width:620px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">

<!-- Header -->
<tr>
<td style="background:#111827;padding:40px;text-align:center;">

<div style="
width:72px;
height:72px;
background:#ffffff;
border-radius:18px;
display:inline-flex;
align-items:center;
justify-content:center;
font-size:34px;
margin-bottom:18px;
">
🚘
</div>

<h1 style="
margin:0;
color:#ffffff;
font-size:30px;
font-weight:700;
">
Car Dealership Inventory
</h1>

<p style="
margin:12px 0 0;
color:#d1d5db;
font-size:16px;
">
Secure Email Verification
</p>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:45px 40px;">

<p style="
margin:0;
font-size:16px;
color:#374151;
line-height:28px;
">
Hello,
</p>

<p style="
margin:18px 0 32px;
font-size:16px;
color:#4b5563;
line-height:28px;
">
Thanks for registering with
<strong>Car Dealership Inventory System</strong>.

To verify your email address, enter the verification code shown below.
</p>

<!-- OTP Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<div style="
display:inline-block;
background:#f9fafb;
border:2px dashed #2563eb;
border-radius:16px;
padding:22px 40px;
">

<div style="
font-size:13px;
color:#6b7280;
letter-spacing:2px;
margin-bottom:12px;
text-transform:uppercase;
font-weight:bold;
">
Verification Code
</div>

<div style="
font-size:42px;
font-weight:800;
letter-spacing:12px;
font-family:Consolas,monospace;
color:#2563eb;
">
${otp}
</div>

</div>

</td>
</tr>
</table>

<!-- Expiry -->
<div style="
margin-top:34px;
background:#eff6ff;
border-left:5px solid #2563eb;
padding:18px 20px;
border-radius:10px;
">

<p style="
margin:0;
font-size:15px;
color:#1e3a8a;
line-height:24px;
">
⏳ This verification code will expire in
<strong>5 minutes.</strong>
</p>

</div>

<!-- Security -->
<div style="
margin-top:22px;
background:#fff7ed;
border-left:5px solid #f97316;
padding:18px 20px;
border-radius:10px;
">

<p style="
margin:0;
font-size:15px;
line-height:24px;
color:#7c2d12;
">
<strong>Security Reminder</strong><br><br>

• Never share this code with anyone.<br>
• Our team will never ask for your OTP.<br>
• If you didn't request this email, you can safely ignore it.
</p>

</div>

<p style="
margin-top:34px;
font-size:15px;
line-height:28px;
color:#4b5563;
">
If you experience any issues, simply contact our support team and we'll be happy to help.
</p>

<p style="
margin-top:32px;
font-size:16px;
color:#111827;
font-weight:bold;
">
Thank you,<br>
Car Dealership Inventory Team
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="
background:#f9fafb;
border-top:1px solid #e5e7eb;
padding:30px;
text-align:center;
">

<p style="
margin:0;
font-size:13px;
color:#6b7280;
line-height:24px;
">
This is an automated email. Please do not reply.
</p>

<p style="
margin-top:10px;
font-size:12px;
color:#9ca3af;
line-height:22px;
">
© ${new Date().getFullYear()} Car Dealership Inventory System<br>
All rights reserved.
</p>

</td>
</tr>

</table>

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