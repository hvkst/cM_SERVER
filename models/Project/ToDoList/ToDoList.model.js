const { Schema, model } = require('mongoose');

const toDoListSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
});

const User = model('ToDoList', toDoListSchema);

module.exports = User;
