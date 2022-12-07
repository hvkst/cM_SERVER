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
    // Add user ref to project
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

// DELETE route to remove user and the project inside and the sections inside
router.delete('/user/remove', async (req, res, next) => {
  const { userId } = req.body;

  try {
    const userToDelete = await User.find({ _id: userId }).populate('projects');

    const sectionsToDelete = [];
    const projectsToDelete = [];
    userToDelete[0].projects.forEach((project) => {
      projectsToDelete.push(project._id);

      project.sections.forEach((section) => {
        sectionsToDelete.push(section._id);
      });
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
        },
      },
    ]);

    return res.json({ message: 'Got full user data', user });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error getting full user data: ' + error.message });
  }
});

// SECTION ROUTES ###############################################

// POST to add section
router.post('/user/section/add', async (req, res, next) => {
  try {
    const { section, projectId } = req.body;

    const newSection = new Section({
      title: section,
    });

    const savedSection = await newSection.save();

    const project = await Project.findOneAndUpdate({ _id: projectId }, { $push: { sections: savedSection } }, { new: true }).populate('sections');

    return res.json({ message: 'added section', project });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in adding a section: ' + error.message });
  }
});

// DELETE route to remove section
router.delete('/user/section/remove', async (req, res, next) => {
  const { projectId, sectionId } = req.body;

  try {
    const projectToUpdate = await Project.findOne(projectId);
    projectToUpdate.pull({ _id: sectionId });

    await Section.deleteOne({ _id: sectionId });

    const updatedProject = await Project.find(projectId).populate('sections');

    return res.json({ message: 'Successfully deleted user', updatedProject });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error deleting the section: ' + error.message });
  }
});
// POST route to rename section
router.post('/user/section/update', async (req, res, next) => {
  const { projectId, sectionId, newTitle } = req.body; //add description here later

  try {
    await Section.findByIdAndUpdate(sectionId, { title: newTitle });

    const updatedProject = await Project.find(projectId).populate('sections');

    return res.json({ message: 'Successfully updated section', updatedProject });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error updating the section: ' + error.message });
  }
});

// PROJECT ROUTES ###############################################

// DELETE route to remove project
router.delete('/user/project/remove', async (req, res, next) => {
  const { userId, projectId } = req.body;

  try {
    const projectToDelete = await Project.find({ _id: projectId });

    const sectionsToDelete = [];

    projectToDelete.sections.forEach((section) => {
      sectionsToDelete.push(section._id);
    });

    await Section.deleteMany({
      _id: {
        $in: sectionsToDelete,
      },
    });

    await Project.deleteOne({ _id: projectToDelete });

    const updatedUser = await User.find({ _id: userId }, { password: 0 }).populate([
      {
        path: 'projects',
        model: 'Project',
        populate: {
          path: 'sections',
          model: 'Section',
        },
      },
    ]);

    return res.json({ message: 'Successfully deleted project', updatedUser });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error deleting the project: ' + error.message });
  }
});

// POST route to rename project
router.post('/user/project/update', async (req, res, next) => {
  const { projectId, newTitle } = req.body; //add description here later

  try {
    const updatedProject = await Project.findByIdAndUpdate(projectId, { title: newTitle }, { new: true });

    return res.json({ message: 'Successfully updated Project', updatedProject });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error updating the section: ' + error.message });
  }
});

// POST route to add project
router.post('/user/project/add', async (req, res, next) => {
  try {
    const { project, userId } = req.body;

    const newProject = new Project({
      title: project,
    });

    const savedProject = await newProject.save();

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $push: { projects: savedProject } }, { new: true }, { password: 0 }).populate([
      {
        path: 'projects',
        model: 'Project',
        populate: {
          path: 'sections',
          model: 'Section',
        },
      },
    ]);

    return res.json({ message: 'Successfully added Project', updatedUser });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in adding a section: ' + error.message });
  }
});

module.exports = router;
