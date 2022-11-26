const bcrypt = require('bcrypt')

function geraSenhaHash(senha) {
	const custoHash = 12
	const hash = bcrypt.hash(senha, custoHash)
	return hash
}

module.exports = geraSenhaHash