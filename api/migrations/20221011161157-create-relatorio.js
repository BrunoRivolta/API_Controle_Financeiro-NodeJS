'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('relatorios', {
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
				references: { model: 'usuarios', key: 'id'}
			},
			alimentacao: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
				allowNull: false
			},
			saude: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
				allowNull: false
			},
			moradia: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
				allowNull: false
			},
			transporte: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
				allowNull: false
			},
			educacao: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
				allowNull: false
			},
			lazer: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
				allowNull: false
			},
			imprevistos: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
				allowNull: false
			},
			outros: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
				allowNull: false
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
		await queryInterface.dropTable('relatorios')
	}
}
