// checks if user is logged in
const isLoggedIn = (req, res, next) => {
  console.log('Is logged IN!');
  console.log(req.session);
  // console.log(req.session.currentUser);
  if (!req.session.currentUser) {
    return res.redirect('/login');
  }
  next();
};

// checks if user is looged out
const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    console.log('Is logged OUT!');
    return res.redirect('/');
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
