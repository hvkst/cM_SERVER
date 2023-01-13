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

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/admin', isLoggedIn, adminRoutes);

const projectRoutes = require('./routes/project.routes');
app.use('/admin/user/project', projectRoutes);

const sectionRoutes = require('./routes/section.routes');
app.use('/admin/user/section', sectionRoutes);

const commentRoutes = require('./routes/comment.routes');
app.use('/comment', commentRoutes);

const apiRoutes = require('./routes/api.routes');
app.use('/api', apiRoutes);

const uploadRoutes = require('./routes/upload.routes');
app.use('/upload', uploadRoutes);

const contactRoutes = require('./routes/contact.routes');
app.use('/contact', contactRoutes);

const indexRoutes = require('./routes/index.routes');
app.get('/', indexRoutes);

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

require('./error-handling')(app);

module.exports = app;
