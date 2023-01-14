// Basic setup copied from ironlauncher

const express = require('express');

const expressSanitizer = require('express-sanitizer');

const logger = require('morgan');

const cookieParser = require('cookie-parser');

// ℹ️ Serves a custom favicon on each request
// https://www.npmjs.com/package/serve-favicon
const favicon = require('serve-favicon');

const cors = require('cors');
const FRONTEND_URL = process.env.ORIGIN || 'http://localhost:3000';
const path = require('path');
const corsOptions = require('./corsOptions');

const CLIENT_ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

// Middleware configuration
module.exports = (app) => {
  app.set('trust proxy', 1);
  // Static File Declaration
  app.use('/', express.static(path.join(__dirname, 'public')));
  // Normalizes the path to the views folder
  app.set('views', path.join(__dirname, '..', 'views'));

  // In development environment the app logs
  app.use(logger('dev'));
  app.use(cors(corsOptions));
  // app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

  // To have access to `body` property in the request
  app.use(express.json({ limit: '50mb' }));
  app.use(expressSanitizer());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Handles access to the favicon
  app.use(favicon(path.join(__dirname, '..', 'public', 'images', 'favicon.ico')));
  app.use((req, res, next) => {
    // console.log(req.session);
    // console.log(req.user);
    next();
  });
};
