'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Usuarios', [
			{
				id: 1,
				nome: 'Bruno Rivolta',
				email: 'brrivolta@gmail.com',
				senha: '123456'
			},{
				id: 2,
				nome: 'Talissa Dallosta',
				email: 'talissa_santos@hotmail.com',
				senha: '123456'
			}
		], {})
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Usuarios', null, {})

	}
}
