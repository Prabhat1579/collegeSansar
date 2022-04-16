// Include Sequelize module.
const Sequelize = require('sequelize');

const db = require('../config/db');
const { sequelize } = db;

const User = sequelize.define('user', {
   id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },

   name: { type: Sequelize.STRING, allowNull: false },

   email: { type: Sequelize.STRING, allowNull: false },

   password: { type: Sequelize.STRING, allowNull: false },

   date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

module.exports = User;
