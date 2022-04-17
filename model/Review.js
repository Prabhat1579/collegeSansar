// Include Sequelize module.
const Sequelize = require('sequelize');

const db = require('../config/db');
const College = require('./College');
const User = require('./User');
const { sequelize } = db;

const Review = sequelize.define('review', {
   id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
   },

   college_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
         model: College,
         key: id,
      },
   },

   user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
         model: User,
         key: id,
      },
   },

   title: { type: Sequelize.STRING, allowNull: false },

   description: { type: Sequelize.TEXT, allowNull: false },

   rate: { type: Sequelize.STRING, allowNull: false },

   date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

module.exports = Review;
