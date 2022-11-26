'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Receitas', [
			{
				descricao: 'Salario',
				valor: 800.80,
				data: 20220705,
				usuario_id: 1,
			},{
				descricao: 'Adiantamento',
				valor: 300.95,
				data: 20220705,
				usuario_id: 1,
			},{
				descricao: 'Vendas',
				valor: 200.32,
				data: 20220705,
				usuario_id: 1,
			},
		], {})
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('People', null, {})
	}
}
