const database = require('../models')
const tokens = require('./tokens')
const { EmailVerificacao } = require('../verifEmail/email')
const geraSenhaHash = require('./senhaHash')

function geraEndereco(rota, token) {
	const baseURL = process.env.BASE_URL
	return `${baseURL}${rota}${token}`
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

	static async verificaEmail(req, res) {
		const id = req.user.id
		try {
			await database.Usuarios.update({emailVerificado: true}, { where: { id: Number(id) } })
			res.status(200).json()
		} catch (erro) {
			res.status(500).json({ erro: erro.message})
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
			const usuario = await database.Usuarios.create(dadosNovoUsuario)

			const tokenVerificaEmail = tokens.verificacaoEmail.cria(usuario.id)
			const endereco = geraEndereco('/usuario/verifica_email/', tokenVerificaEmail)
			const emailVerificacao = new EmailVerificacao(usuario, endereco)
			emailVerificacao.enviaEmail()

			res.status(201).json()
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
				await database.Relatorio.destroy( {where: { usuario_id: Number(id) } }, {transaction: transacao})
				await database.Receitas.destroy( {where: { usuario_id: Number(id) } }, {transaction: transacao})
				await database.Despesas.destroy( {where: { usuario_id: Number(id) } }, {transaction: transacao})			
				await database.Usuarios.destroy( {where: { id: Number(id) } }, {transaction: transacao})
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

