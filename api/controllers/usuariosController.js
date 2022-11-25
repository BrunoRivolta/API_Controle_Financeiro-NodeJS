const database = require('../models')
const bcrypt = require('bcrypt')
const tokens = require('./tokens')

function geraSenhaHash(senha) {
	const custoHash = 12
	const hash = bcrypt.hash(senha, custoHash)
	return hash
}

class UsuariosController {
	
	static async login (req, res) {
		try {
			const acessToken = tokens.access.cria(req.user.id)
			const refreshToken = await tokens.refresh.cria(req.user.id)
			res.set('Authorization', acessToken)
			res.status(200).send({ refreshToken })
		} catch (erro) {
			res.status(500).json({ erro: erro.message })
		}
	}

	static async logout (req, res) {
		try {
			const token = req.token
			await tokens.access.invalida(token)
			res.status(204).send()
		} catch (erro) {
			res.status(500).json({ erro: erro.message })
		}
	}

	static async listaUsuarios(req, res) {
		try {
			const usuarios = await database.Usuarios.findAll()
			res.status(200).json(usuarios) 
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}

	static async listaUsuarioPorId(req, res) {
		const { id } = req.params
		try {
			const usuario = await database.Usuarios.findOne( { where: {id: Number(id)}})
			if (usuario != null) {
				res.status(200).json(usuario)
			} else {
				res.status(200).json({message: `O id ${id}, não existe`})
			}
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}

	static async adicionarUsuario(req, res) {
		try{
			const dadosNovoUsuario = req.body
			const senhaHash = await geraSenhaHash(dadosNovoUsuario.senha)
			dadosNovoUsuario.senha = senhaHash
			const novoUsuario = await database.Usuarios.create(dadosNovoUsuario)
			res.status(200).json(novoUsuario)
		} catch(err) {
			res.status(500).json({ message: err.message })
		}
	}

	static async atualizaUsuario(req, res) {
		const { id } = req.params
		const atualizacao = req.body
		try{
			await database.Usuarios.update(atualizacao, { where: { id: Number(id) } })
			return res.status(200).json({ message: `O usuario ID: ${id}, foi atualizada`})
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}

	static async apagaUsuario(req, res) {  
		const { id } = req.params
		try {
			database.sequelize.transaction(async transacao => {
				await database.Usuarios.destroy( {where: { id: Number(id) } }, {transaction: transacao})
				await database.Receitas.destroy( {where: { usuario_id: Number(id) } }, {transaction: transacao})
				await database.Despesas.destroy( {where: { usuario_id: Number(id) } }, {transaction: transacao})			
				await database.Relatorio.destroy( {where: { usuario_id: Number(id) } }, {transaction: transacao})
				return res.status(200).json({ message: `Usuario id ${id} deletado junto com todos seus registros` })
			})
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}

	static async restauraUsuario(req, res) {
		const { id } = req.params
		try {
			await database.Usuarios.restore({ where: { id: Number(id) } })
			return res.status(200).json({message: `o usuario id: ${id} foi restaurada com sucesso!`})
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}
}

module.exports = UsuariosController

