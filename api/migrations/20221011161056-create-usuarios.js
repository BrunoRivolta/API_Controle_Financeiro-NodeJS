'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Usuarios', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			email: {				
				allowNull: false,
				type: Sequelize.STRING
			},
			nome: {
				allowNull: false,
				type: Sequelize.STRING
			},
			senha: {
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
			},
			emailVerificado: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
				defaultValue: Sequelize.literal('0')
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Usuarios')
	}
}