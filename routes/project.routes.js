const router = require('express').Router();
const User = require('../models/User.model');
const Project = require('../models/Project/Project.model');
const Section = require('../models/Project/Section.model');

// PROJECT ROUTES ###############################################

// POST route to rename project
// router.post('/update', async (req, res, next) => {
//   const { projectId, newTitle } = req.body; //add description here later

//   try {
//     const updatedProject = await Project.findByIdAndUpdate(projectId, { title: newTitle }, { new: true });

//     return res.json({ message: 'Successfully updated Project', updatedProject });
//   } catch (error) {
//     console.log('There was an error', error);
//     return res.status(500).json({ error: 'There was an error updating the section: ' + error.message });
//   }
// });

// Not yet in use...

// DELETE route to remove project
// router.delete('/remove', async (req, res, next) => {
//   const { userId, projectId } = req.body;

//   try {
//     const projectToDelete = await Project.find({ _id: projectId });

//     const sectionsToDelete = [];

//     projectToDelete.sections.forEach((section) => {
//       sectionsToDelete.push(section._id);
//     });

//     await Section.deleteMany({
//       _id: {
//         $in: sectionsToDelete,
//       },
//     });

//     await Project.deleteOne({ _id: projectToDelete });

//     const updatedUser = await User.find({ _id: userId }, { password: 0 }).populate([
//       {
//         path: 'projects',
//         model: 'Project',
//         populate: {
//           path: 'sections',
//           model: 'Section',
//         },
//       },
//     ]);

//     return res.json({ message: 'Successfully deleted project', updatedUser });
//   } catch (error) {
//     console.log('There was an error', error);
//     return res.status(500).json({ error: 'There was an error deleting the project: ' + error.message });
//   }
// });

// POST route to add project
// router.post('/add', async (req, res, next) => {
//   try {
//     const { project, userId } = req.body;

//     const newProject = new Project({
//       title: project,
//     });

//     const savedProject = await newProject.save();

//     const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $push: { projects: savedProject } }, { new: true }, { password: 0 }).populate([
//       {
//         path: 'projects',
//         model: 'Project',
//         populate: {
//           path: 'sections',
//           model: 'Section',
//         },
//       },
//     ]);

//     return res.json({ message: 'Successfully added Project', updatedUser });
//   } catch (error) {
//     console.log('There was an error', error);
//     return res.status(500).json({ error: 'There was an error in adding a section: ' + error.message });
//   }
// });

module.exports = router;
