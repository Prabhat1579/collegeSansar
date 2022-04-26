// Include Sequelize module.
const Sequelize = require('sequelize');

const db = require('../config/db');
const { sequelize } = db;

const Admin = sequelize.define('admin', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},

	email: { type: Sequelize.STRING, allowNull: false },

	password: { type: Sequelize.STRING, allowNull: false },

	date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

module.exports = Admin;
