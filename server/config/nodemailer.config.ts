// config/nodemailer.config.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail({ email, subject, text }: { email: string; subject: string; text: string;}) {
  if (!email || !subject || !text) {
    throw new Error("Email, subject, and text are required parameters.");
  }
  // Prepare the email options
  const nodemailerOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: subject || 'Welcome to Our Service',
    text: text || `Hello thanks for cinsidering our service`,

  }
  const info = await transporter.sendMail(nodemailerOptions);

  console.log('Message sent: %s', info.envelope.to);


}

// Verify at startup
transporter.verify(err => {
  if (err) console.error('✉️ SMTP connection error:', err);
  else console.log('✅ SMTP ready');
});

export default sendMail;