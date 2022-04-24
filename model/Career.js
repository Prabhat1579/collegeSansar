// Include Sequelize module.
const Sequelize = require('sequelize');

const db = require('../config/db');

const { sequelize } = db;

const Career = sequelize.define('career', {
   id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },

   careerName: { type: Sequelize.STRING, allowNull: false },

   careerDescription: { type: Sequelize.TEXT, allowNull: true },

   featuredImage: { type: Sequelize.STRING, allowNull: true },

   date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

module.exports = Career;
