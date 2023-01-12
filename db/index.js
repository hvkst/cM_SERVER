// Basic setup copied from ironlauncher

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI; // || 'mongodb://127.0.0.1:27017/custoMe_server';

const connection = mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongo: ', err);
  });

module.exports = connection;
