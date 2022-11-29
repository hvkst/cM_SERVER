const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const connection = require('./db');
// const User = connection.models.User;
const User = require('../models/User.model');
const validPassword = require('../lib/passwordUtils').validPassword;

const customFields = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true, // allows us to access req in the call back
};

const verifyCallback = (req, username, password, done) => {
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      const isValid = validPassword(password, user.password);

      if (isValid) {
        return done(
          null,
          user
          //   {
          //   name: user.username,
          // }
        );
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
