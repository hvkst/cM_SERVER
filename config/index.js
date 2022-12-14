// Basic setup copied from ironlauncher

const express = require('express');

const expressSanitizer = require('express-sanitizer');

const logger = require('morgan');

const cookieParser = require('cookie-parser');

const cors = require('cors');

// const path = require('path');

const CLIENT_ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

// Middleware configuration
module.exports = (app) => {
  app.set('trust proxy', 1);

  // Static File Declaration
  // app.use(express.static(path.join(__dirname, 'client/build')));

  app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

  // In development environment the app logs
  app.use(logger('dev'));

  // To have access to `body` property in the request
  app.use(express.json({ limit: '50mb' }));
  app.use(expressSanitizer());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use((req, res, next) => {
    // console.log(req.session);
    // console.log(req.user);
    next();
  });
};
