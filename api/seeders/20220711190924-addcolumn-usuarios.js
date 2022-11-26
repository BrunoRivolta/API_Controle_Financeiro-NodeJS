'use strict'
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('Usuarios', 'deletedAt', {
			allowNull: true,
			type: Sequelize.DATE
		})
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn('Usuarios', 'deletedAt')
	}
}

/*
esta migração cria a coluna deletedAt na tabela usuarios, assim o paranoid pode indicar se o registro 
foi deletado ou nao e caso esteja deletado podemos recupera-lo
*/

