const router = require('express').Router();

const nodemailer = require('nodemailer');
// const env = process.env.NODE_ENV || 'development';
// const config = require(path.join(__dirname, '/../config/config.json'))[env];

router.post('/sendform', (req, res, next) => {
  console.log(req.body);
  const message = {
    from: req.body.mail,
    to: 'ironhack@hvkst.com',
    subject: req.body.product,
    text: req.body.message,
    html: `
    <p>New Email from your awesome website!</p>
    ------------
    <p>From:<br> 
    a${req.body.name}<br>
    b${req.body.mail}<br>
    c${req.body.phone}
    </p>
    ------------
    <p>
    ${req.body.message}
    Customer wishes a callback: ${req.body.callback}
    </p>
    `,
  };

  let transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take our messages');
    }
  });

  transporter.sendMail(message, function (err, data) {
    if (err) {
      console.log('Error Occurs');
    } else {
      console.log('Email sent successfully');
    }
  });

  res.json('Contact form received');
});

module.exports = router;
