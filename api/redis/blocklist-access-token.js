const jwt = require('jsonwebtoken')
const { createHash } = require('crypto')
const manipulaLista = require('./manipula-lista')
const redis =  require('redis')

const blocklist = redis.createClient({ prefix: 'blocklist-acessToken:'})
const manipulaBlockList = manipulaLista(blocklist)

function geraTokenHash (token) { //os tokens tem varios tamanho, essa funcao transforma o token em um hash com tamanho fixo
	return createHash('sha256').update(token).digest('hex')
}

module.exports = {
	async adiciona (token) {
		const dataExpiracao = jwt.decode(token).exp //tempo de expiração do token
		const tokenHash = geraTokenHash(token)
		await manipulaBlockList.adiciona(tokenHash, '', dataExpiracao)
	},
	async contemToken (token) { //busca o token na base
		const tokenHash = geraTokenHash(token)
		return manipulaBlockList.contemChave(tokenHash)
	}
}