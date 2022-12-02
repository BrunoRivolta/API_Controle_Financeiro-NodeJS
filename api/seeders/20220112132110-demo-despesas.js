'use strict'

require('dotenv').config()
const process = require('process')
const env = process.env.NODE_ENV
const geraSenhaHash = require('../controllers/senhaHash')

const senha = geraSenhaHash('123456');

const {database, username, password, dialect} = require(__dirname + '/../config/config.json')[env];

console.log(`Ambiente de desenvolvimento "${env}"`)

module.exports = {
	async up (queryInterface, Sequelize) {
    	const sequelize = new Sequelize("", username, password, {
      		dialect: dialect,
    	});

		return sequelize.query(
			`INSERT INTO ${database}.despesas (id, descricao, valor, data, categoria_id, usuario_id) VALUES` +
			` (1, 'Mercado', '152.21', '20221101', 1, 1),` +
			` (2, 'Farmacia', '42.85', '20221102', 2, 1),` +
			` (3, 'Internet', '205.52', '20221103', 3, 1),` +
			` (4, 'Combustivel', '55.31', '20221104', 4, 1),` +
			` (5, 'Cursos', '82.11', '20221105', 5,  1),` +
			` (6, 'Cinema', '72.85', '20221106', 6, 1),` +
			` (7, 'Mecânico', '52.80', '20221107', 7, 1),` +
			` (8, 'Doação', '20', '20221108', 8, 1);`
    	)
	},
    
	async down (queryInterface, Sequelize) {
    	const sequelize = new Sequelize("", username, password, {
        	dialect: dialect,
      	});

      	return sequelize.query(
			`DELETE FROM ${database}.despesas WHERE (id = 1);`
    	);
    },
};