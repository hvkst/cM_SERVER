const { sendEmail } = require('../lib/nodeMailerUtils');

const router = require('express').Router();

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

  sendEmail(message);
  res.json('Contact form received');
});

module.exports = router;
