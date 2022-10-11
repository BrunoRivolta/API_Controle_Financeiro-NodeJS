'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Relatorios', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			mes: {
				type: Sequelize.INTEGER
			},
			ano: {
				type: Sequelize.INTEGER
			},
			receitas: {
				type: Sequelize.FLOAT
			},
			despesas: {
				type: Sequelize.FLOAT
			},
			saldo: {
				type: Sequelize.FLOAT
			},
			alimentacao: {
				type: Sequelize.FLOAT
			},
			saude: {
				type: Sequelize.FLOAT
			},
			moradia: {
				type: Sequelize.FLOAT
			},
			transporte: {
				type: Sequelize.FLOAT
			},
			educacao: {
				type: Sequelize.FLOAT
			},
			lazer: {
				type: Sequelize.FLOAT
			},
			imprevistos: {
				type: Sequelize.FLOAT
			},
			outros: {
				type: Sequelize.FLOAT
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Relatorios')
	}
}