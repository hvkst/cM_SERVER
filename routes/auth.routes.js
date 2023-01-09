const express = require('express');
const genPassword = require('../lib/passwordUtils').genPassword;
const validPassword = require('../lib/passwordUtils').validPassword;

const { isLoggedOut } = require('../middleware/route-guard.js');

const User = require('../models/User.model');

const router = express.Router();

// This is only possible by admin in Admin Backend

// POST /auth/signup  - Creates a new user in the database
// router.post('/signup', async (req, res, next) => {
//   //isLoggedOut, ?
//   const { password, username } = req.body;

//   try {
//     const newUser = new User({
//       username: username,
//       password: await genPassword(password),
//       admin: true,
//     });

//     await newUser.save().then((user) => {
//       console.log('user:', user);
//       req.session.currentUser = { name: user.username, isAdmin: user.admin };
//     });

//     console.log(req.session.currentUser);

//     return res.json({ message: 'Successfully signed up' });
//   } catch (error) {
//     console.log('There was an error', error);
//     return res.status(500).json({ error: 'There was an error in the signup: ' + error.message });
//   }
// });

router.post('/login', async (req, res) => {
  //  isLoggedOut, ?
  try {
    const userFromDb = await User.findOne({
      username: req.body.username,
    });
    const passwordsMatch = await validPassword(req.body.password, userFromDb.password);

    if (!passwordsMatch) {
      console.log("Passwords didn't match");
      throw new Error('Login failed');
    }

    console.log('Everything fine... on login');

    const user = { id: userFromDb._id, username: userFromDb.username, isAdmin: userFromDb.admin };
    req.session.currentUser = user;
    console.log(req.session.currentUser);

    // serialization => putting something like an object => into a value we can send. utf8 string.
    return res.json({
      message: 'Successfully logged in!',
      user,
    });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error during login. Please make sure username and password are correct.' });
    // return res.status(500).json({ error: 'There was an error during login: ' + error.message });
  }
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    console.log('LOGGED OUT');
    res.json({ message: 'Successfully logged out!' });
  });
});

router.get('/verify', (req, res, next) => {
  try {
    console.log(req.session);
    if (!req.session.currentUser) {
      return res.json({ message: 'No user here' });
    }
    return res.json({ user: req.session.currentUser });
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: 'There was an error' });
  }
});

module.exports = router;
