const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = (plainPassword) => {
   const salt = bcrypt.genSaltSync(saltRounds);
   const hash = bcrypt.hashSync(plainPassword, salt);
   return hash;
};

module.exports = hashPassword;
