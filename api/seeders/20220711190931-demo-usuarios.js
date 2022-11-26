const geraSenhaHash = require('../controllers/senhaHash')

const senhaHash = geraSenhaHash('123456')

'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Usuarios', [
			{
				id: 1,
				nome: 'Teste Unitário',
				email: 'usuario@deteste.com',
				senha: await senhaHash,
				emailVerificado: '1'
			},
			{
				id: 2,
				nome: 'Bruno Rivolta',
				email: 'brrivolta@gmail.com',
				senha: await senhaHash,
				emailVerificado: '1'
			},{
				id: 3,
				nome: 'Talissa Dallosta',
				email: 'talissa_santos@hotmail.com',
				senha: await senhaHash,
				emailVerificado: '1'
			}
		], {})
	},
	async down (queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Usuarios', null, {})

	}
}
