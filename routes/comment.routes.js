const router = require('express').Router();
const User = require('../models/User.model');
const Project = require('../models/Project/Project.model');
const Section = require('../models/Project/Section.model');
const Comment = require('../models/Project/Comments/Comment.model');
const { sendEmail } = require('../lib/nodeMailerUtils');

// POST route to create new users
router.post('/new', async (req, res, next) => {
  const { content, sectionId, projectId, UserId } = req.body;

  console.log('req.body', req.body);

  try {
    const user = await User.findById(UserId);
    const section = await Section.findById(sectionId);
    const project = await Project.findById(projectId);

    const newComment = new Comment({
      content: content,
      username: user.username,
      isAdmin: user.admin,
      section: sectionId,
      // project: projectId,as
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

    // if comment is send by user, inform admin
    if (!user.admin) {
      const message = {
        from: 'ironhack@hvkst.com',
        to: 'ironhack@hvkst.com',
        subject: 'New Comment',
        text: req.body.message,
        html: `
      <p>${user.username} commented on "${section.title}" in "${project.title}".</p>
      ------------</br>
      "${content}"</br>
      ------------</br>
      ${newComment.createdAt.toLocaleString('de-DE')}
  </p>`,
      };

      sendEmail(message);
    }

    return res.json({ message: 'Comment saved on server', currentProject });
  } catch (error) {
    console.log('There was an error', error);
    return res.status(500).json({ error: 'There was an error saving the user: ' + error.message });
  }
});

module.exports = router;
