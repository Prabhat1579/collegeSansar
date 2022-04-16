const dotenv = require('dotenv');
const path = require('path');

dotenv.config('.env', { path: path.resolve(__dirname, '.env') });

const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

const host = process.env.host;
const user = process.env.user;
const password = process.env.password;
const db_name = process.env.db_name;
const dialect = process.env.dialect;

module.exports = {
   PORT,
   SECRET_KEY,
   host,
   user,
   password,
   db_name,
   dialect,
};
