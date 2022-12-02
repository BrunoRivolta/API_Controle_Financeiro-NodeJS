const geraSenhaHash = require('../controllers/senhaHash')

describe('Testando gerador de senhaHash', () => {
	it('Deve gerar uma senha hash', async () => {
        const senha = '123456'
		const hash = geraSenhaHash(senha)

		expect(senha).not.toBe(hash)
	})
})
