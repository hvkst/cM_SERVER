const router = require('express').Router();
const Project = require('../models/Project/Project.model');
const Section = require('../models/Project/Section.model');

// SECTION ROUTES ###############################################

const sectionsAndComments = [
  {
    path: 'sections',
    model: 'Section',
    populate: {
      path: 'comments',
      model: 'Comment',
    },
  },
];

// POST to add section
router.post('/add', async (req, res, next) => {
  try {
    const { section, projectId } = req.body;

    const newSection = new Section({
      title: section,
    });

    const savedSection = await newSection.save();

    const project = await Project.findOneAndUpdate({ _id: projectId }, { $push: { sections: savedSection } }, { new: true }).populate(
      sectionsAndComments
    );

    return res.json({ message: 'Successfully added section', project });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error in adding a section: ' + error.message });
  }
});

// DELETE route to remove section
router.delete('/remove', async (req, res, next) => {
  const { projectId, sectionId } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate({ _id: projectId }, { $pull: { sections: sectionId } }, { new: true }).populate(
      sectionsAndComments
    );

    await Section.deleteOne({ _id: sectionId });

    return res.json({ message: 'Successfully deleted section', updatedProject });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error deleting the section: ' + error.message });
  }
});

// POST route to update section
router.post('/update', async (req, res, next) => {
  const { projectId, sectionId, title, description, prep, main, final } = req.body;

  try {
    await Section.findByIdAndUpdate(sectionId, {
      title: title,
      description: description,
      prep: prep,
      main: main,
      final: final,
    });
    const updatedProject = await Project.find({ _id: projectId }).populate(sectionsAndComments);
    // console.log('Updated Section On Server', updatedProject);
    return res.json({ message: 'Successfully updated section', updatedProject });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error updating the section: ' + error.message });
  }
});

module.exports = router;
