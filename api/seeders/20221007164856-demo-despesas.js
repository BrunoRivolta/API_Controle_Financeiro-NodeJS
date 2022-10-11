'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Despesas', [
			{
				descricao: 'Mercado',
				valor: 152.21,
				data: 20220705,
				categoria: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				descricao: 'Farmacia',
				valor: 42.85,
				data: 20220708,
				categoria: 2,
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				descricao: 'Conta Internet',
				valor: 205.52,
				data: 20220715,
				categoria: 3,
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				descricao: 'Posto Gasolina',
				valor: 55.31,
				data: 20220722,
				categoria: 4,
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				descricao: 'Curso Alura',
				valor: 82.11,
				data: 20220718,
				categoria: 5,
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				descricao: 'Cinema',
				valor: 72.85,
				data: 20220730,
				categoria: 6,
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				descricao: 'Mecânico',
				valor: 52.80,
				data: 20220724,
				categoria: 7,
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				descricao: 'Doação',
				valor: 20,
				data: 20220703,
				categoria: 8,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {})
	},

	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('People', null, {})
	}
}
