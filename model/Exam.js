// Include Sequelize module.
const Sequelize = require('sequelize');

const db = require('../config/db');

const { sequelize } = db;

const Exam = sequelize.define('exam', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},

	user_id: {
		type: Sequelize.INTEGER,
		allowNull: true,
	},

	examTitle: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	examType: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	examCategory: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	contact: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	admitCardReleaseDate: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	eligibility: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	examDate: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	result: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	overview: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	featurtedImage: {
		type: Sequelize.TEXT,
		allowNull: true,
	},

	practicePaper: {
		type: Sequelize.TEXT,
		allowNull: true,
	},

	syllabus: {
		type: Sequelize.STRING,
		allowNull: true,
	},

	date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

module.exports = Exam;
