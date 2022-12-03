const router = require('express').Router();
const genPassword = require('../lib/passwordUtils').genPassword;
const User = require('../models/User.model');
const Project = require('../models/Project/Project.model');

router.post('/user/new', async (req, res, next) => {
  const { password, username, project, duedate } = req.body;

  try {
    const newProject = new Project({
      title: project,
      dueDate: duedate,
    });

    const savedProject = await newProject.save();

    const newUser = new User({
      username: username,
      password: await genPassword(password),
      project: savedProject._id,
    });

    const savedUser = await newUser.save();

    console.log('new user saved', savedUser);

    return res.json({ message: 'Successfully created user' });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in the signup: ' + error.message });
  }
});

module.exports = router;
