'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('receitas', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			descricao: {
				allowNull: false,
				type: Sequelize.STRING
			},
			valor: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
			},
			data: {
				allowNull: false,
				type: Sequelize.DATE
			},
			usuario_id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				references: { model: 'usuarios', key: 'id'}
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
		await queryInterface.dropTable('receitas')
	}
}