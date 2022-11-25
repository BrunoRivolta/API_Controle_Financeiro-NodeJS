'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Usuarios', [
			{
				id: 1,
				nome: 'Bruno Rivolta',
				email: 'brrivolta@gmail.com',
				senha: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5MzI1NzMxLCJleHAiOjE2NjkzMjY2MzF9.uljXadtqy_nK1DUZxv0r8zKC8LwMC4MWnkvjR_Aq5YM'
			},{
				id: 2,
				nome: 'Talissa Dallosta',
				email: 'talissa_santos@hotmail.com',
				senha: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5MzI1NzMxLCJleHAiOjE2NjkzMjY2MzF9.uljXadtqy_nK1DUZxv0r8zKC8LwMC4MWnkvjR_Aq5YM'
			}
		], {})
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Usuarios', null, {})

	}
}
