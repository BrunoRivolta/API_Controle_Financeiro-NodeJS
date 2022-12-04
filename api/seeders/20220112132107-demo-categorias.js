'use strict'

require('dotenv').config()
const process = require('process')
const env = process.env.NODE_ENV

const {database, username, password, dialect} = require(__dirname + '/../config/config.json')[env];

console.log(`Ambiente de desenvolvimento "${env}"`)

module.exports = {
	async up (queryInterface, Sequelize) {
    	const sequelize = new Sequelize("", username, password, {
      		dialect: dialect,
    	});

		return sequelize.query(
			`INSERT INTO ${database}.categoria (id, nome) VALUES` +
			` (1, 'Alimentação'),` +
			` (2, 'Saúde'),` +
			` (3, 'Moradia'),` +
			` (4, 'Transporte'),` +
			` (5, 'Educação'),` +
			` (6, 'Lazer'),` +
			` (7, 'Imprevistos'),` +
			` (8, 'Outros');`
    	)
	},
    
	async down (queryInterface, Sequelize) {
    	const sequelize = new Sequelize("", username, password, {
        	dialect: dialect,
      	});

      	return sequelize.query(
			`DELETE FROM ${database}.usuarios WHERE (id = 1);`
    	);
    },
};