const allowedOrigins = require('./allowedOrigins');
const CLIENT_ORIGIN = process.env.ORIGIN;

const corsOptions = {
  origin: (origin, callback) => {
    if (CLIENT_ORIGIN.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
