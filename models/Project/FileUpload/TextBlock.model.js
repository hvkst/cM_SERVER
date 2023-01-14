// Not yet in use

const { Schema, model } = require('mongoose');

const textContentSchema = new Schema(
  {
    section: { type: Schema.Types.ObjectId, ref: 'Section' },
    title: String,
    content: String,
  },
  { timestamps: true }
);

const TextContent = model('TextContent', textContentSchema);

module.exports = TextContent;
