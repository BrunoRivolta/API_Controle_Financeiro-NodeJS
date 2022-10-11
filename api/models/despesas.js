'use strict'
const {
	Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Despesas extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
		}
	}
	Despesas.init({
		descricao: DataTypes.STRING,
		valor: DataTypes.FLOAT,
		data: DataTypes.DATE,
		categoria: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'Despesas',
	})
	return Despesas
}