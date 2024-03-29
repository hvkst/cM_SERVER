const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    section: { type: Schema.Types.ObjectId, ref: 'Section' },
    username: String,
    content: String,
    isAdmin: Boolean,
  },
  { timestamps: true }
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;
