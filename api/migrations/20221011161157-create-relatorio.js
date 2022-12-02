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
				allowNull: false,
				type: Sequelize.INTEGER
			},
			ano: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			receitas: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			despesas: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
			},
			saldo: {
				type: Sequelize.FLOAT,
			},
			usuario_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: { model: 'Usuarios', key: 'id'}
			},
			alimentacao: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			saude: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			moradia: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			transporte: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			educacao: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			lazer: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			imprevistos: {
				type: Sequelize.FLOAT,
				defaultValue: 0
			},
			outros: {
				type: Sequelize.FLOAT,
				defaultValue: 0
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
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Relatorios')
	}
}
