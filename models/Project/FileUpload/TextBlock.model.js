// Not yet in use

const { Schema, model } = require('mongoose');

const textBlockSchema = new Schema(
  {
    section: { type: Schema.Types.ObjectId, ref: 'Section' },
    title: String,
    content: String,
  },
  { timestamps: true }
);

const TextBlock = model('TextBlock', textBlockSchema);

module.exports = TextBlock;
