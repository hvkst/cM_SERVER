// const CLIENT_ORIGIN = process.env.ORIGIN;

const whitelist = ['https://finalproject.hvkst.com', 'http://localhost:3000', 'c-m-client-git-main-hvkst.vercel.app'];
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

module.exports = corsOptions;
