const { Schema, model } = require('mongoose');

const sectionSchema = new Schema({
  // project: { type: Schema.Types.ObjectId, ref: 'Project' },
  title: {
    type: String,
    required: [true, 'Title is required.'],
  },
  description: {
    type: String,
  },
  prep: {
    type: String,
  },
  main: {
    type: String,
  },
  final: {
    type: String,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

const Section = model('Section', sectionSchema);

module.exports = Section;
