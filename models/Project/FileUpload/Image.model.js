const { Schema, model } = require('mongoose');

const imageSchema = new Schema(
  {
    content: {
      type: String,
      // trim: true,
    },
    section: {
      type: { type: Schema.Types.ObjectId, ref: 'Section' },
    },
    imgPath: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Image', imageSchema);
