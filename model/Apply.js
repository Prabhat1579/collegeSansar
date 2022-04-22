// Include Sequelize module.
const Sequelize = require('sequelize');

const db = require('../config/db');

const { sequelize } = db;

const Apply = sequelize.define('apply', {
   id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },

   college_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },

   user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
   },

   date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

module.exports = Apply;
