const router = require('express').Router();
const genPassword = require('../lib/passwordUtils').genPassword;
const User = require('../models/User.model');
const Project = require('../models/Project/Project.model');
const Section = require('../models/Project/Section.model');

// GET route to get all users

router.get('/user', async (req, res, next) => {
  try {
    const allUsers = await User.find({ admin: false }, { password: 0 }).populate('projects');

    return res.json({ message: 'Got all users', allUsers });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in the signup: ' + error.message });
  }
});

// POST route to create new users
router.post('/user/new', async (req, res, next) => {
  const { password, username, project, duedate } = req.body;

  try {
    // Create a Section
    const newSection = new Section({
      title: 'main',
    });
    const savedSection = await newSection.save();

    // Create a project with that section
    const newProject = new Project({
      title: project,
      dueDate: duedate,
    });
    newProject.sections.push(savedSection);
    const savedProject = await newProject.save();

    // Create a user with that project
    const newUser = new User({
      username: username,
      password: await genPassword(password),
    });
    newUser.projects.push(savedProject);

    // Save that user
    const savedUser = await newUser.save();
    console.log('new user saved', savedUser);

    // Get all Users again to update on Client
    const allUsers = await User.find({ admin: false }, { password: 0 }).populate('projects');

    return res.json({ message: 'Successfully created user', allUsers });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in the signup: ' + error.message });
  }
});

// POST route to remove user and the project inside and the sections inside
router.post('/user/remove', async (req, res, next) => {
  const { userId } = req.body;

  try {
    const userToDelete = await User.findById(userId);
    const userToDeleteWithProjects = await User.findById(userId).populate('projects');

    // Delete all sections in all projects of that user
    userToDeleteWithProjects.projects.forEach((project) => {
      project.sections.forEach((section) => {
        Section.findByIdAndDelete(section._id);
      });
    });

    // Delete all projects of that user
    userToDelete.projects.forEach((project) => {
      Project.findByIdAndDelete(project._id);
    });

    await User.findByIdAndDelete(userId);

    const allUsers = await User.find({ admin: false }, { password: 0 }).populate('projects');

    return res.json({ message: 'Successfully deleted user', allUsers });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in the signup: ' + error.message });
  }
});

// GET full single user
router.get('/user/:userId/', async (req, res, next) => {
  try {
    const user = await User.find({ _id: req.params.userId }).populate([
      {
        path: 'projects',
        model: 'Project',
        populate: {
          path: 'sections',
          model: 'Section',
        },
      },
    ]);

    return res.json({ message: 'Got full user data', user });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in the signup: ' + error.message });
  }
});

// Better to change everything in single chunks...
router.post('/addsection/:projectId/', async (req, res, next) => {
  try {
    const { section } = req.body;

    const newSection = new Section({
      title: section,
    });

    const savedSection = await newSection.save();

    const project = await Project.findOneAndUpdate({ _id: req.params.projectId }, { $push: { sections: savedSection } }, { new: true }).populate(
      'sections'
    );

    return res.json({ message: 'added section', project });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in the editing: ' + error.message });
  }
});

module.exports = router;
