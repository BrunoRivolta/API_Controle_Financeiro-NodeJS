const database = require('../models')

class CategoriaController {
	static async listaCategoria(req, res) {
		try {
			const categorias = await database.Categoria.findAll() // findAll é um comando sequelize, categoria é puxado la de models categoria no final do arquivo existe um return Categoria é ele mesmo chamamos aqui.
			res.status(200).json(categorias)
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}
}

module.exports = CategoriaController






