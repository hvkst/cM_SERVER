const express = require('express');
const bcrypt = require('bcryptjs');
// const { isLoggedOut } = require('../middleware/route-guard.js');

const User = require('../models/User.model');

const router = express.Router();
const saltRounds = 10;

async function generateHash(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

// POST /auth/signup  - Creates a new user in the database
router.post('/signup', async (req, res, next) => {
  const { password, username } = req.body;
  try {
    const newUser = new User({
      username: username,
      password: await generateHash(password),
    });
    const user = await newUser.save();
    req.session.currentUser = { name: user.name };

    return res.json({ message: 'Successfully signed up', user });
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
    const passwordsMatch = await bcrypt.compare(req.body.password, userFromDb.password);

    if (!passwordsMatch) {
      console.log("Passwords didn't match");
      throw new Error('Login failed');
    }

    console.log('Everything fine...');

    const user = { username: userFromDb.username };
    req.session.currentUser = user;

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
