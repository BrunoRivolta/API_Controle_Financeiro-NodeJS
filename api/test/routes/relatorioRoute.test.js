const { afterEach, beforeEach, describe, expect, it } = require('@jest/globals')
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

describe('GET em /relatorio', () => {
	it('Deve retornar uma lista de relatorios', async () => {
		const resposta = await request(app)
			.get('/relatorio')
			.expect(200) 

		expect(resposta.body[0].saldo).toEqual(400)
	})
})

describe('GET em /relatorio/mes/ano', () => {
	it('Deve retornar um relatorio de um mes e ano especifico', async () => {
		const resposta = await request(app)
			.get('/relatorio/07/2022')
			.expect(200)

		expect(resposta.body.receitas).toEqual(1000)
	})
})
