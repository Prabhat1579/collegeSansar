const chalk = require('chalk');
const { db_name, user, password, host, dialect } = require('./env');

const { Sequelize } = require('sequelize');

const db = {};

const sequelize = new Sequelize(db_name, user, password, {
   host: host,
   dialect: dialect /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

const connect = () => {
   sequelize
      .authenticate()
      .then(() => {
         console.log(chalk.bold.blue('DB Connected!'));
      })
      .catch((err) => {
         console.error(chalk.bold.red('DB Connection Failed!', err));
      });
};

db.sequelize = sequelize;
db.connect = connect;

module.exports = db;
