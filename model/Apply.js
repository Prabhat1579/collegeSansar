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

   fullName: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   email: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   phone: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   dob: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   fatherName: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   motherName: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   parentContact: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   citizenId: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   citizenship: {
      type: Sequelize.TEXT,
      allowNull: true,
   },

   photo: {
      type: Sequelize.TEXT,
      allowNull: true,
   },

   slcGrade: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   plus2Grade: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   slcMarksheet: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   plus2Marksheet: {
      type: Sequelize.STRING,
      allowNull: true,
   },

   date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

module.exports = Apply;
