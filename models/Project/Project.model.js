const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {
    type: String,
    required: [true, 'Title is required.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  dueDate: {
    type: String, // ?
  },
  toDoList: [{ type: Schema.Types.ObjectId, ref: 'ToDoList' }],
  sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
});

const Project = model('Project', projectSchema);

module.exports = Project;
