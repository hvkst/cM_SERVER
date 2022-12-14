const router = require('express').Router();
const User = require('../models/User.model');
const Image = require('../models/Project/FileUpload/Image.model');

// ********* require fileUploader in order to use it *********
const fileUploader = require('../config/cloudinary.config');

// // POST route to create new users
// router.post('/new', async (req, res, next) => {
//   const { content, sectionId, projectId, UserId } = req.body;

//   console.log('req.body', req.body);

//   try {
//     // Create a Comment // TODO: What Ids do you REALLY need?
//     const user = await User.findById(UserId);

//     const newComment = new Comment({
//       content: content,
//       // username: username,
//       isAdmin: user.admin,
//       section: sectionId,
//       project: projectId,
//     });
//     await newComment.save();
//     // Get ProjectData
//     await Section.findOneAndUpdate({ _id: sectionId }, { $push: { comments: newComment } });

//     const currentProject = await Project.find({ _id: projectId }).populate([
//       {
//         path: 'sections',
//         model: 'Section',
//         populate: {
//           path: 'comments',
//           model: 'Comment',
//         },
//       },
//     ]);
//     return res.json({ message: 'Comment saved on server', currentProject });
//   } catch (error) {
//     console.log('There was an error', error);
//     return res.status(500).json({ error: 'There was an error saving the user: ' + error.message });
//   }
// });

router.post('/images/new', fileUploader.single('picPath'), (req, res, next) => {
  console.log(req.body);
  // const { picName, content } = req.body;

  // content
  // section
  // imgPath

  // Post.create({
  //   picName,
  //   content,
  //   picPath: req.file.path,
  // })

  //   .then((dbResponse) => {
  //     console.log('Newly created post: ', dbResponse);
  //     res.redirect('/user-profile');
  //   })

  //   .catch((err) => {
  //     console.log(`Err while creating the post in the DB: ${err}`);
  //     next(err);
  //   }); // close .catch()
});

module.exports = router;
