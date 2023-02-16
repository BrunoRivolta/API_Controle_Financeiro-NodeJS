'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('usuarios', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			email: {				
				allowNull: false,
				type: Sequelize.STRING,
				unique: true
			},
			nome: {
				allowNull: false,
				type: Sequelize.STRING
			},
			sobrenome: {
				allowNull: true,
				type: Sequelize.STRING
			},
			telefone: {
				allowNull: true,
				type: Sequelize.STRING
			},
			cep: {
				allowNull: true,
				type: Sequelize.STRING
			},
			endereco: {
				allowNull: true,
				type: Sequelize.STRING
			},
			numero: {
				allowNull: true,
				type: Sequelize.INTEGER
			},
			bairro: {
				allowNull: true,
				type: Sequelize.STRING
			},
			cidade: {
				allowNull: true,
				type: Sequelize.STRING
			},
			estado: {
				allowNull: true,
				type: Sequelize.STRING
			},
			senha: {
				allowNull: false,
				type: Sequelize.STRING
			},
			emailVerificado: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
				defaultValue: Sequelize.literal('0')
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
			deletedAt: {
				allowNull: true,
				type: Sequelize.DATE,
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('usuarios')
	}
}