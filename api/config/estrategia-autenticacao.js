const LocalStrategy = require('passport-local').Strategy
const database = require('../models')
const { InvalidArgumentError } = require('../erros')
const bcrypt = require('bcrypt')
const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const jwt = require('jsonwebtoken')
const blocklist = require('../redis/blocklist-access-token')

function verificaUsuario(usuario) {
	if(!usuario) {
		throw new InvalidArgumentError('Nao existe usuario com este e-mail')
	}
}

async function verificaTokenBlacklist (token) {
	const tokenBlocklist = await blocklist.contemToken(token)
	if (tokenBlocklist) {
		throw new jwt.JsonWebTokenError('Token invalido por logout')
	}
}

async function verificaSenha(senha, senhaHash) {
	const senhaValida = await bcrypt.compare(senha, senhaHash)
	if (!senhaValida) {
		throw new InvalidArgumentError('Email ou senha invalidos')
	}
}

module.exports = function(passport) {
	passport.use(
		new LocalStrategy({
			usernameField: 'email',
			passwordField: 'senha',
			session: false
		}, async (email, senha, done) => {
			try{
				const usuario = await database.Usuarios.findOne({ where: { email: email } })
				verificaUsuario(usuario)
				await verificaSenha(senha, usuario.senha)
				done(null, usuario)
	
			} catch(erro) {
				done()
			}
		})
	)
}

passport.use(
	new BearerStrategy( async (token, done) => {
		try {
			await verificaTokenBlacklist(token)
			const payload = jwt.verify(token, process.env.CHAVE_JWT)
			const usuario = await database.Usuarios.findOne({ where: { id: payload.id } })
			done(null, usuario, { token: token })
		} catch (erro) {
			done(erro)
		}
	})
)



