function geraEndereco(rota, token) {
	const baseURL = process.env.BASE_URL
	return `${baseURL}${rota}${token}`
}

module.exports = geraEndereco