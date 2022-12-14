const router = require('express').Router();
const User = require('../models/User.model');
const Project = require('../models/Project/Project.model');
const Section = require('../models/Project/Section.model');
const Comment = require('../models/Project/Comments/Comment.model');

// POST route to create new users
router.post('/new', async (req, res, next) => {
  const { content, sectionId, projectId, UserId } = req.body;

  console.log('req.body', req.body);

  try {
    // Create a Comment
    const newComment = new Comment({
      content: content,
      author: UserId,
      section: sectionId,
      project: projectId,
    });
    await newComment.save();
    // Get ProjectData
    await Section.findOneAndUpdate({ _id: sectionId }, { $push: { comments: newComment } });

    const currentProject = await Project.find({ _id: projectId }).populate([
      {
        path: 'sections',
        model: 'Section',
        populate: {
          path: 'comments',
          model: 'Comment',
        },
      },
    ]);
    return res.json({ message: 'Comment saved on server', currentProject });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error saving the user: ' + error.message });
  }
});

module.exports = router;
