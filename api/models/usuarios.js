'use strict'
const {
	Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
	class Usuarios extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			Usuarios.hasMany(models.Despesas, { foreignKey: 'usuario_id' })
			Usuarios.hasMany(models.Receitas, { foreignKey: 'usuario_id' })
			Usuarios.hasMany(models.Relatorio, { foreignKey: 'usuario_id' })
		}
	}
	Usuarios.init({
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: {
					args: true,
					msg: 'Dados do tipo email invalidos'
				}
			}
		},
		nome: {
			type: DataTypes.STRING,                                    
			validate: {
				maisDe3Caracteres: function(dado) {
					if (dado.length < 3) throw new Error('O campo deve ter mais de 3 caracteres')
				}
			}
		},
		sobrenome: DataTypes.STRING,
		telefone: DataTypes.STRING,
		cep: DataTypes.STRING,
		endereco: DataTypes.STRING,
		numero: DataTypes.INTEGER,
		bairro: DataTypes.STRING,
		cidade: DataTypes.STRING,
		estado: DataTypes.STRING,
		senha: DataTypes.STRING,
		emailVerificado: {
			type: DataTypes.BOOLEAN
		}
	}, {
		sequelize,
		modelName: 'Usuarios',
		paranoid: true
	})

	return Usuarios
}