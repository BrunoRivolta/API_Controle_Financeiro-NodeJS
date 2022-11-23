'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Despesas', [
			{
				descricao: 'Mercado',
				valor: 152.21,
				data: 20220705,
				categoria_id: 3,
				usuario_id: 1,
			},{
				descricao: 'Farmacia',
				valor: 42.85,
				data: 20220708,
				categoria_id: 2,
				usuario_id: 1,
			},{
				descricao: 'Conta Internet',
				valor: 205.52,
				data: 20220715,
				categoria_id: 3,
				usuario_id: 1,
			},{
				descricao: 'Posto Gasolina',
				valor: 55.31,
				data: 20220722,
				categoria_id: 4,
				usuario_id: 1,
			},{
				descricao: 'Curso Alura',
				valor: 82.11,
				data: 20220718,
				categoria_id: 5,
				usuario_id: 1,
			},{
				descricao: 'Cinema',
				valor: 72.85,
				data: 20220730,
				categoria_id: 6,
				usuario_id: 1,
			},{
				descricao: 'Mecânico',
				valor: 52.80,
				data: 20220724,
				categoria_id: 7,
				usuario_id: 1,
			},{
				descricao: 'Doação',
				valor: 20,
				data: 20220703,
				categoria_id: 8,
				usuario_id: 1,
			}
		], {})
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('People', null, {})
	}
}
