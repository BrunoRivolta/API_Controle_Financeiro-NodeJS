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
			Despesas.belongsTo(models.Categoria, { foreignKey: 'categoria_id' })
			Despesas.belongsTo(models.Usuarios, { foreignKey: 'usuario_id' })
		}
	}
	Despesas.init({
		descricao: {
			type: DataTypes.STRING,                                    
			validate: {
				maisDe3Caracteres: function(dado) {
					if (dado.length < 3) throw new Error('O campo deve ter mais de 3 caracteres')
				}
			}
		},
		valor: DataTypes.FLOAT,
		data: DataTypes.DATE,
	}, {
		sequelize,
		modelName: 'Despesas',
		paranoid: true
	})
	return Despesas
}