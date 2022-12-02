const LocalStrategy = require('passport-local').Strategy
const database = require('../models')
const { InvalidArgumentError } = require('../erros')
const bcrypt = require('bcrypt')
const passport = require('passport')
const BearerStrategy = require('passport-http-bearer').Strategy
const tokens = require('../controllers/tokens')

function verificaUsuario(usuario) {
	if(!usuario) {
		throw new InvalidArgumentError('Email ou senha invalidos')
	}
}

async function verificaSenha(senha, senhaHash) {
	const senhaValida = await bcrypt.compare(senha, senhaHash)
	if (!senhaValida) {
		throw new InvalidArgumentError('Email ou senha invalidos')
	}
}

async function vefiricaEmailValidado(usuario) {
	const validado = usuario.emailVerificado
	if (validado === false) {
		throw new InvalidArgumentError('Email não foi validado, verifique sua caixa de e-mail')		
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
				await vefiricaEmailValidado(usuario)
				done(null, usuario)
			} catch(erro) {
				done(erro)
			}
		})
	)
}

passport.use(
	new BearerStrategy( async (token, done) => {
		try {
			const id = await tokens.access.verifica(token)
			const usuario = await database.Usuarios.findOne({ where: { id: id } })
			done(null, usuario, { token: token })
		} catch (erro) {
			done(erro)
		}
	})
)



