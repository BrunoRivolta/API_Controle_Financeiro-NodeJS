'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) { //up quando a migração e enviada para o banco de dados
		await queryInterface.createTable('Categoria', { //create table é comando mysql criar tabela
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			nome: {
				allowNull: false,
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('now()')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('now()')
			}
		})
	},
	async down(queryInterface, Sequelize) { //downm quano ela e removida do bando de dados
		await queryInterface.dropTable('Categoria') //drop table é comando my sql apagar tabela
	}
}