const CLIENT_ORIGIN = process.env.ORIGIN;

// const corsOptions = {
//   origin: 'https://finalproject.hvkst.com',
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
const whitelist = ['https://finalproject.hvkst.com' /** other domains if any */];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
