'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Categoria', [
			{
				id: 1,
				nome: 'alimentacao',
			},{
				id: 2,
				nome: 'saude',
			},{
				id: 3,
				nome: 'moradia',
			},{
				id: 4,
				nome: 'transporte',
			},{
				id: 5,
				nome: 'educacao',
			},{
				id: 6,
				nome: 'lazer',
			},{
				id: 7,
				nome: 'imprevistos',
			},{
				id: 8,
				nome: 'outros',
			}
		], {})
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Categoria', null, {})
	}
}