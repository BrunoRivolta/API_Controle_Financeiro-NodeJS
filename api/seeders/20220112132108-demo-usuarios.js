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
			`INSERT INTO ${database}.usuarios (id, email, nome, senha, emailVerificado) VALUES` +
			` (1, 'usuario1@test.com', 'Teste Unitário', '${await senha}', 1);`
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