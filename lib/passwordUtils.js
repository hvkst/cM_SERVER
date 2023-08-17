const bcrypt = require('bcryptjs');
const saltRounds = 10;

async function genPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

function validPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
