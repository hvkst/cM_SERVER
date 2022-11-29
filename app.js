// Basic setup copied from ironlauncher

require('dotenv').config();

require('./db');

const express = require('express');

const app = express();

// use session here:
require('./config/session.config')(app);

require('./config')(app);

require('./config/passport.config');

// 👇 Start handling routes here
const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

// const authRoutes = require('./routes/auth.routes');
// app.use('/auth', authRoutes);

const apiRoutes = require('./routes/api.routes');
app.use('/api', apiRoutes);

require('./error-handling')(app);

module.exports = app;
