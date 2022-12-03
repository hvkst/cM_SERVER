const { Schema, model } = require('mongoose');

const sectionSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

const User = model('Section', sectionSchema);

module.exports = User;
