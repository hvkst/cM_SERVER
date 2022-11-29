const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  admin: Boolean, // User should not even have that in the end
});

const User = model('User', userSchema);

module.exports = User;
