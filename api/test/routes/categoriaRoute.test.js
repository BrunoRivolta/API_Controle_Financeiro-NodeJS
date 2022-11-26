const { afterEach, beforeEach, describe, expect, it, afterAll } = require('@jest/globals')
const request = require('supertest')
const app = require('../../app')

let server
  
beforeEach(() => {
	const port = 8000
	server = app.listen(port)
	console.log(`Servidor de testes porta ${port} ativo`)
})

afterEach(() => {
	server.close()
	console.log('Servidor de testes desativado')
})

describe('GET em /categorias', () => {
	it('Deve retornar a lista de categorias', async () => {
		const resposta = await request(app)
			.get('/categorias')
			.expect(200) 

		expect(resposta.body[0].nome).toEqual('alimentacao')
		expect((resposta.body).length).toBe(8)
	})
})

