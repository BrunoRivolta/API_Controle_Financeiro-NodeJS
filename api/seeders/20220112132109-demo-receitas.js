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
			`INSERT INTO ${database}.receitas (id, descricao, valor, data, usuario_id) VALUES` +
			` (1, 'Salário', '800.80', '20221101', 1),` +
			` (2, 'Adiantamento', '300.95', '20221102', 1),` +
			` (3, 'Vendas', '200.32', '20221103', 1);`
    	)
	},
    
	async down (queryInterface, Sequelize) {
    	const sequelize = new Sequelize("", username, password, {
        	dialect: dialect,
      	});

      	return sequelize.query(
			`DELETE FROM ${database}.receitas WHERE (id = 1);`
    	);
    },
};