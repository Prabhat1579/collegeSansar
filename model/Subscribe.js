// Include Sequelize module.
const Sequelize = require('sequelize');

const db = require('../config/db');

const { sequelize } = db;

const Subscribe = sequelize.define('subscribe', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},

    email:{
        type: Sequelize.STRING,
        allowNull: false
    },

    name:{
        type: Sequelize.STRING,
        allowNull: false
    },

	examDate: {
		type: Sequelize.DATE,
		allowNull: false,
	},
	title:{
		type: Sequelize.STRING,
        allowNull: true
	},
	
	date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
});

module.exports = Subscribe;
