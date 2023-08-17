// Not yet in use

const { Schema, model } = require('mongoose');

const replySchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    // comment: { type: Schema.Types.ObjectId, ref: 'Comment' }, //?
    content: String,
  },
  { timestamps: true }
);

const Reply = model('Reply', replySchema);

module.exports = Reply;
