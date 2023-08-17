const router = require('express').Router();
const genPassword = require('../lib/passwordUtils').genPassword;
const User = require('../models/User.model');
const Project = require('../models/Project/Project.model');
const Section = require('../models/Project/Section.model');
const Comment = require('../models/Project/Comments/Comment.model');

// GET route to get all users
router.get('/user', async (req, res, next) => {
  // console.log("Something incoming from the client's request", req.body);
  try {
    const allUsers = await User.find({ admin: false }, { password: 0 }).populate('projects');

    return res.json({ message: 'Got all users', allUsers });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error getting UserData: ' + error.message });
  }
});

// POST route to create new users
router.post('/user/new', async (req, res, next) => {
  const { password, username, project, duedate } = req.body;

  try {
    // Create a project
    const newProject = new Project({
      title: project,
      dueDate: duedate,
    });

    const savedProject = await newProject.save();

    // Create a user with that project
    const newUser = new User({
      username: username,
      password: await genPassword(password),
    });
    newUser.projects.push(savedProject);
    // Maybe add user ref to project
    // project.user = user._id;

    // Save that user
    const savedUser = await newUser.save();
    console.log('new user saved', savedUser);

    // Get all Users again to update on Client
    const allUsers = await User.find({ admin: false }, { password: 0 }).populate('projects');

    return res.json({ message: 'Successfully created user', allUsers });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error saving the user: ' + error.message });
  }
});

// POST route to update user and basic project data
router.post('/user/update', async (req, res, next) => {
  const { username, project, dueDate, userId, projectId } = req.body;

  try {
    console.log('TO SERVER', req.body);
    await Project.findByIdAndUpdate(projectId, { title: project, dueDate: dueDate }, { new: true });
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, { username: username }, { new: true, password: 0 }).populate([
      {
        path: 'projects',
        model: 'Project',
        populate: {
          path: 'sections',
          model: 'Section',
          populate: {
            path: 'comments',
            model: 'Comment',
          },
        },
      },
    ]);

    console.log('updatedUser', updatedUser);

    return res.json({ message: 'Successfully updated User', updatedUser });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error updating the user: ' + error.message });
  }
});

// DELETE route to remove user and the project inside and the sections inside
router.delete('/user/remove', async (req, res, next) => {
  const { userId } = req.body;

  try {
    const userToDelete = await User.find({ _id: userId }).populate('projects');

    // Not ideal, but it get´s the job done,
    // but with more models related to Users, I need a better solution
    // This broke... section.comments.forEach not working
    const sectionsToDelete = [];
    const projectsToDelete = [];
    const commentsToDelete = [];
    userToDelete[0].projects.forEach((project) => {
      projectsToDelete.push(project._id);
      project.sections.forEach((section) => {
        sectionsToDelete.push(section._id);
        section.comments.forEach((comment) => {
          commentsToDelete.push(comment._id);
        });
      });
    });

    await Comment.deleteMany({
      _id: {
        $in: commentsToDelete,
      },
    });

    await Section.deleteMany({
      _id: {
        $in: sectionsToDelete,
      },
    });

    await Project.deleteMany({
      _id: {
        $in: projectsToDelete,
      },
    });

    await User.deleteOne({ _id: userId });

    const allUsers = await User.find({ admin: false }, { password: 0 }).populate('projects');

    return res.json({ message: 'Successfully deleted user', allUsers });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error deleting the user: ' + error.message });
  }
});

// GET full single user
router.get('/user/:userId/', async (req, res, next) => {
  try {
    const user = await User.find({ _id: req.params.userId }, { password: 0 }).populate([
      {
        path: 'projects',
        model: 'Project',
        populate: {
          path: 'sections',
          model: 'Section',
          populate: {
            path: 'comments',
            model: 'Comment',
          },
        },
      },
    ]);

    return res.json({ message: 'Got full user data', user });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error getting full user data: ' + error.message });
  }
});

module.exports = router;
