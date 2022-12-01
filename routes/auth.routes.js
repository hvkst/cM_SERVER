const express = require('express');
const genPassword = require('../lib/passwordUtils').genPassword;
const validPassword = require('../lib/passwordUtils').validPassword;

const User = require('../models/User.model');

// const isAuth = require('./middleware/route-guard').isAuth;
// const isAdmin = require('./middleware/route-guard').isAdmin;

const router = express.Router();

// POST /auth/signup  - Creates a new user in the database
router.post('/signup', async (req, res, next) => {
  const { password, username } = req.body;

  try {
    const newUser = new User({
      username: username,
      password: await genPassword(password),
      admin: true,
    });

    await newUser.save().then((user) => {
      console.log('user:', user);
      req.session.currentUser = { name: user.username };
    });

    console.log(req.session.currentUser);

    return res.json({ message: 'Successfully signed up' });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in the signup: ' + error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const userFromDb = await User.findOne({
      username: req.body.username,
    });
    const passwordsMatch = await validPassword(req.body.password, userFromDb.password);

    if (!passwordsMatch) {
      console.log("Passwords didn't match");
      throw new Error('Login failed');
    }

    console.log('Everything fine...');

    const user = { username: userFromDb.username };
    req.session.currentUser = user;
    console.log(req.session.currentUser);

    // serialization => putting something like an object => into a value we can send. utf8 string.
    return res.json({
      message: 'Successfully logged in!',
      user,
    });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in the signup: ' + error.message });
  }
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.json({ message: 'Successfully logged out!' });
  });
});

module.exports = router;
