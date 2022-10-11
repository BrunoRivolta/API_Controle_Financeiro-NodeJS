'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Categoria', [
			{
				nome: 'alimentacao',
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				nome: 'saude',
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				nome: 'moradia',
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				nome: 'transporte',
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				nome: 'educacao',
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				nome: 'lazer',
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				nome: 'imprevistos',
				createdAt: new Date(),
				updatedAt: new Date()
			},{
				nome: 'outros',
				createdAt: new Date(),
				updatedAt: new Date()
			}
		], {})
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Categoria', null, {})
	}
}