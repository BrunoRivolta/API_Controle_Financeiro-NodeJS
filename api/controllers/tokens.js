const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const moment = require('moment')
const allowlistRefreshToken = require('../redis/allowlist-refresh-token')
const blocklistAccessToken = require('../redis/blocklist-access-token')
const { InvalidArgumentError } = require('../erros')


function criaTokenJWT (id, [tempoQuantidade, tempoUnidade]) {
	const payload = { id }
	const token = jwt.sign(payload, process.env.CHAVE_JWT, 
		{ expiresIn: tempoQuantidade + tempoUnidade })
	return token
}

async function verificaTokenOpaco(token, nome, allowlist) {
	verificaTokenEnviado(token, nome)
	const id = await allowlist.buscaValor(token)
	verificaTokenValido(id, nome)
	return id
}

function verificaTokenValido(id, nome) {
	if (!id) {
		throw new InvalidArgumentError(`${nome} é invalido!`)
	}
}

function verificaTokenEnviado(token, nome) {
	if (!token) {
		throw new InvalidArgumentError(`${nome} não enviado!`)
	}
}

async function verificaTokenBlocklist (token, nome, blocklist) {
	if (!blocklist) {
		return
	}
	const tokenBlocklist = await blocklist.contemToken(token)
	if (tokenBlocklist) {
		throw new jwt.JsonWebTokenError(`${nome} invalido por logout`)
	}
}

function invalidaTokenJWT(token, blocklist) {
	return blocklist.adiciona(token)
}

async function invalidaTokenOpaco(token, allowlist) {
	await allowlist.deleta(token)
}

async function verificaTokenJWT(token, nome, blocklist) {
	await verificaTokenBlocklist(token, nome, blocklist)
	const { id } = jwt.verify(token, process.env.CHAVE_JWT)
	return id
}

async function criaTokenOpaco (id, [tempoQuantidade, tempoUnidade], allowlist) {
	const tokenOpaco = crypto.randomBytes(25).toString('hex')
	const dataExpiracao = moment().add(tempoQuantidade, tempoUnidade).unix() //expira em 1 dia
	await allowlist.adiciona(tokenOpaco, id, dataExpiracao)
	return tokenOpaco
}

module.exports = {
	access: {
		nome: 'Access Token',
		lista: blocklistAccessToken,
		expiracao: [30, 'm'],
		cria(id) {
			return criaTokenJWT(id, this.expiracao)
		},
		verifica(token) {
			return verificaTokenJWT(token, this.nome, this.lista)
		},
		invalida(token) {
			return invalidaTokenJWT(token, this.lista)
		}
	},
	refresh: {
		nome: 'Refresh Token',
		lista: allowlistRefreshToken,
		expiracao: [2, 'd'],
		cria(id) {
			return criaTokenOpaco(id, this.expiracao, this.lista)
		},
		verifica(token) {
			return verificaTokenOpaco(token, this.nome, this.lista)
		},
		invalida(token) {
			return invalidaTokenOpaco(token, this.lista)
		}
	},
	verificacaoEmail: {
		nome: 'token de verificacao de e-mail',
		expiracao: [6, 'h'],
		cria(id) {
			return criaTokenJWT(id, this.expiracao)
		},
		verifica(token) {
			return verificaTokenJWT(token, this.nome)
		}
	},
	recuperaConta: {
		nome: 'token de recuperação de conta',
		expiracao: [15, 'd'],
		cria(id) {
			return criaTokenJWT(id, this.expiracao)
		},
		verifica(token) {
			return verificaTokenJWT(token, this.nome)
		}
	}
}