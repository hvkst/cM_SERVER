const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required.'],
  },
  createdAt: {
    type: Date, // ?
  },
  dueDate: {
    type: Date, // ?
  },
  toDoList: {
    type: [], // Probably ref
  },
  sections: {
    type: [],
  },
  // some sort of comments
});

const User = model('Project', projectSchema);

module.exports = User;
