const { Schema, model } = require('mongoose');
const Project = require('./Project/Project.model');

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    // select: false,
  },
  admin: { type: Boolean, default: 'false' },
  showWelcomeMessage: { type: Boolean, default: 'true' },
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
});

const User = model('User', userSchema);

module.exports = User;
