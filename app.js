// Basic setup copied from ironlauncher

require('dotenv').config();

require('./db');

const path = require('path');

const express = require('express');

const { isLoggedIn } = require('./middleware/route-guard.js');

const app = express();

// use session here:
require('./config/session.config')(app);

require('./config')(app);

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes');
app.get('/', indexRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/admin', adminRoutes);
// app.use('/admin', isLoggedIn, adminRoutes); // 👈Here is something broken, why is the route guard not working anymore? Check req.session.currentUser

const projectRoutes = require('./routes/project.routes');
app.use('/admin/user/project', projectRoutes);

const sectionRoutes = require('./routes/section.routes');
app.use('/admin/user/section', sectionRoutes);

const commentRoutes = require('./routes/comment.routes');
app.use('/comment', commentRoutes);

// const uploadRoutes = require('./routes/upload.routes');
// app.use('/upload', uploadRoutes);

const contactRoutes = require('./routes/contact.routes');
app.use('/contact', contactRoutes);

require('./error-handling')(app);

module.exports = app;
