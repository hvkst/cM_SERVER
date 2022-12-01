// config/session.config.js

const session = require('express-session');

const MongoStore = require('connect-mongo');
const passport = require('passport');

// const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions' });

module.exports = (app) => {
  app.set('trust proxy', 1);

  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 6000000,
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/custoMe_server',
      }),
    })
  );
  app.use(passport.authenticate('session')); // Does this have to be here?
};
