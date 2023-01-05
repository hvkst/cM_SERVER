const nodemailer = require('nodemailer');
// const env = process.env.NODE_ENV || 'development';
// const config = require(path.join(__dirname, '/../config/config.json'))[env];

const message = {
  from: 'ironhack@hvkst.com',
  to: 'bernd@hvkst.com',
  subject: 'Test Mail',
  text: 'Plaintext version of the message',
  html: '<p>HTML version of the message</p>',
};

let transporter = nodemailer.createTransport({
  host: 'norma.uberspace.de',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// transporter.sendMail(message, function (err, data) {
//   if (err) {
//     console.log('Error Occurs');
//   } else {
//     console.log('Email sent successfully');
//   }
// });
