const nodeMailer = require('nodemailer');

const defaultEmailData = { from: 'noreply@node-react.com' };

exports.sendEmail = async (emailData) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  try {
    const info = await transporter.sendMail(emailData);
    return console.log(`Message sent: ${info.response}`);
  } catch (err) {
    return console.log(`Problem sending email: ${err}`);
  }
};
