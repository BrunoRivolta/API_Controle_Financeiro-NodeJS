const process = require('process')
require('dotenv').config()
const geraEndereco = require('../verifEmail/geraEndereco')


describe('Testando gerador de endereços de confirmação', () => {
	it('Deve gerar um endereço', async () => {
		const url = process.env.BASE_URL
        const rota = 'usuarios'
		const token = 'w3w145evbrwen'
		const endereco = geraEndereco(rota, token)

		expect(endereco).toBe(`${url}${rota}${token}`)
	})
})

