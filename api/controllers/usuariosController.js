const database = require('../models')
const tokens = require('./tokens')
const { EmailRecuperacao } = require('../verifEmail/email')
const geraSenhaHash = require('./senhaHash')
const geraEndereco = require('../verifEmail/geraEndereco')
const geraEmailVerificacao = require('../verifEmail/emailVerificacao')

class UsuariosController {

	static async login (req, res) {
		try {
			const acessToken = tokens.access.cria(req.user.id)
			const nomeUsuario = req.user.nome
			const refreshToken = await tokens.refresh.cria(req.user.id)
			res.set('Authorization', acessToken)
			res.status(200).send({ refreshToken, nomeUsuario })
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
		const verificado = {
			emailVerificado: true
		}
		try {
			await database.Usuarios.update(verificado, { where: { id: Number(id) } })
			res.status(200).redirect('http://127.0.0.1:3001')
		} catch (erro) {
			res.status(500).json({ erro: erro.message})
		}
	}

	static async adicionarUsuario(req, res) {
		try{
			const dadosNovoUsuario = req.body
			const senhaHash = await geraSenhaHash(dadosNovoUsuario.senha)
			dadosNovoUsuario.senha = senhaHash 
			dadosNovoUsuario.emailVerificado = true //o email não precisa ser verificado 
			const usuario = await database.Usuarios.create(dadosNovoUsuario)

			geraEmailVerificacao(usuario)
			usuario.senha = null

			res.status(201).json(usuario)
		} catch(err) {
			res.status(500).json({ message: err.message })
		}
	}

	static async listaUsuario(req, res) {
		try {
			const userId = req.user.id
			const usuario = await database.Usuarios.findAll({ where: { id: Number(userId) } })
			res.status(200).json(usuario)  
		} catch (err) {
			res.status(500).json({ message: err.message })
		}
	}

	static async atualizaUsuario(req, res) {
		const id = req.user.id
		const atualizacao = req.body
		try{
			await database.Usuarios.update(atualizacao, { where: { id: Number(id) } })
			return res.status(200).json({ message: 'Atualizado com sucesso!' })
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}

	static async apagaUsuario(req, res) { 
		const usuario = req.user
		const id = req.user.id
		try {
			await database.Usuarios.destroy( {where: { id: Number(id) } })
			const tokenRecuperaConta = tokens.recuperaConta.cria(id)
			const endereco = geraEndereco('/usuarios/restaura_usuario/', tokenRecuperaConta)
			const emailVerificacao = new EmailRecuperacao(usuario, endereco)
			emailVerificacao.enviaEmail()

			return res.status(200).json({ message: 'Usuario apagado' })

		} catch (error) {
			return res.status(500).json(error.message)
		}
	}

	static async restauraUsuario(req, res) {
		const id = req.id
		try {
			await database.Usuarios.restore({ where: { id: Number(id) }})

			return res.status(200).json({message: 'Usuario restaurado(a) com sucesso!'})
		} catch (error) {
			return res.status(500).json(error.message)
		}
	}
}

module.exports = UsuariosController

