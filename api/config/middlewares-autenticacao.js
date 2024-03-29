const passport = require('passport')
const database = require('../models')
require('./estrategia-autenticacao')(passport)
const tokens = require('../controllers/tokens')

module.exports = {
	local (req, res, next) {
		passport.authenticate(
			'local',
			{ session: false },
			(erro, usuario, info) => {
				if (erro && erro.name === 'InvalidArgumentError') {
					return res.status(401).json({ erro: erro.message })
				}

				if (erro) {
					return res.status(500).json({ erro: erro.message })
				}

				if (!usuario) {
					return res.status(401).json()
				}

				req.user = usuario
				return next()
			}
		)(req, res, next)
	},

	bearer (req, res, next) {
		passport.authenticate(
			'bearer',
			{ session: false },
			(erro, usuario, info) => {
				if (erro && erro.name === 'JsonWebTokenError') {
					return res.status(401).json({ erro: erro.message })
				}

				if (erro && erro.name === 'TokenExpiredError') {
					return res.status(401).json({ erro: erro.message, expiradoEm: erro.expiredAt })
				}

				if (erro) {
					return res.status(500).json({ erro: erro.message })
				}

				if (!usuario) {
					return res.status(401).json()
				}
				
				req.token = info.token
				req.user = usuario
				return next()
			}
		)(req, res, next)
	},

	async refresh (req, res, next) {
		try {
			console.log(req.body)
			const { refreshToken } = req.body
			const id = await tokens.refresh.verifica(refreshToken)
			await tokens.refresh.invalida(refreshToken)
			req.user = await database.Usuarios.findOne({ where: { id: id } })
			return next()
		} catch (erro) {
			if (erro.name === 'InvalidArgumentError') {
				return res.status(401).json({ erro: erro.message })
			}
			return res.status(500).json({ erro: erro.message})
		}
	},

	async verificacaoEmail(req, res, next) {
		try {
			const { token } = req.params
			const id = await tokens.verificacaoEmail.verifica(token)
			const usuario = await database.Usuarios.findOne( { where: { id: Number(id) } })
			req.user = usuario
			req.id = id
			next()
		} catch (erro) {
			if (erro.name === 'JsonWebTokenError') {
				return res.status(401).json({ erro: erro.message })
			}
			if (erro.name === 'TokenExpiredError') {
				return res.status(401).json({ erro: erro.message, expiradoEm: erro.expiredAt })
			}
			return res.status(500)
		}
	},

	async restauraContaEmail(req, res, next) {
		try {
			const { token } = req.params
			const id = await tokens.recuperaConta.verifica(token)
			const usuario = await database.Usuarios.findOne( { where: { id: Number(id) }})
			req.user = usuario
			req.id = id
			next()
		} catch (erro) {
			if (erro.name === 'JsonWebTokenError') {
				return res.status(401).json({ erro: erro.message })
			}
			if (erro.name === 'TokenExpiredError') {
				return res.status(401).json({ erro: erro.message, expiradoEm: erro.expiredAt })
			}
			return res.status(500)
		}
	}
}
