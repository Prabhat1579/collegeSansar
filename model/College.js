// Include Sequelize module.
const Sequelize = require('sequelize');

const db = require('../config/db');
const { sequelize } = db;

const College = sequelize.define('college', {
   id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },

   name: { type: Sequelize.STRING, allowNull: false },

   thumbnail: { type: Sequelize.STRING, allowNull: true },

   description: { type: Sequelize.TEXT, allowNull: false },

   fee: { type: Sequelize.STRING, allowNull: true },

   eligibility: { type: Sequelize.STRING, allowNull: true },

   location: { type: Sequelize.TEXT, allowNull: true },

   viewsCount: { type: Sequelize.INTEGER, defaultValue: 0 },

   category: {
      type: Sequelize.STRING,
      allowNull: false,
   },

   courses: {
      type: Sequelize.TEXT,
      allowNull: false,
   },

   date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

module.exports = College;
