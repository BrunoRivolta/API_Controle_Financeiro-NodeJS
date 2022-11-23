const database = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blocklist = require('../redis/blocklist-access-token')
const crypto = require('crypto')
const moment = require('moment')
const allowlistRefreshToken = require('../redis/allowlist-refresh-token')

function geraSenhaHash(senha) {
	const custoHash = 12
	const hash = bcrypt.hash(senha, custoHash)
	return hash
}

function criaTokenJWT (usuario) {
	const payload = {
		id: usuario.id
	}
	const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: '15m' })
	return token
}

async function criaTokenOpaco (usuario) {
	const tokenOpaco = crypto.randomBytes(25).toString('hex')
	const dataExpiracao = moment().add(1, 'd').unix() //expira em 1 dia
	await allowlistRefreshToken.adiciona(tokenOpaco, usuario.id, dataExpiracao)
	return tokenOpaco
}


class UsuariosController {
	
	static async login (req, res) {
		try {
			const acessToken = criaTokenJWT(req.user)
			const refreshToken = await criaTokenOpaco(req.user)
			res.set('Authorization', acessToken)
			res.status(200).send({ refreshToken })
		} catch (erro) {
			res.status(500).json({ erro: erro.message })
		}
	}

	static async logout (req, res) {
		try {
			const token = req.token
			await blocklist.adiciona(token)
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

