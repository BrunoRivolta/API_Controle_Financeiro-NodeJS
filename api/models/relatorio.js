'use strict'
const {
	Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Relatorio extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			Relatorio.belongsTo(models.Usuarios, { foreignKey: 'usuario_id' })
		}
	}
	Relatorio.init({
		mes: DataTypes.INTEGER,
		ano: DataTypes.INTEGER,
		receitas: DataTypes.FLOAT,
		despesas: DataTypes.FLOAT,
		saldo: DataTypes.FLOAT,
		alimentacao: DataTypes.FLOAT,
		saude: DataTypes.FLOAT,
		moradia: DataTypes.FLOAT,
		transporte: DataTypes.FLOAT,
		educacao: DataTypes.FLOAT,
		lazer: DataTypes.FLOAT,
		imprevistos: DataTypes.FLOAT,
		outros: DataTypes.FLOAT
	}, {
		sequelize,
		modelName: 'Relatorio',
	})
	return Relatorio
}