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

let token

describe('POST em /usuarios/login', () => {
	it('Deve fazer o login na aplicação e gerar um token', async () => {
		const resposta = await request(app)
			.post('/usuarios/login')
			.send(
				{
					'email': 'usuario1@test.com',
					'senha': '123456'
				}
			)
			.expect(200)
			
		token = resposta.headers.authorization
	})
})

describe('GET em /relatorio', () => {
	it('Deve retornar uma lista de relatorios', async () => {
		const resposta = await request(app)
			.get('/relatorio')
			.set('Authorization', 'Bearer ' + token)
			.expect(200) 

		expect(resposta.body[0].saldo).toEqual(618.42)
	})
})

describe('GET em /relatorio/mes/ano', () => {
	it('Deve retornar um relatorio de um mes e ano especifico', async () => {
		const resposta = await request(app)
			.get('/relatorio/11/2022')
			.set('Authorization', 'Bearer ' + token)
			.expect(200)

		expect(resposta.body.receitas).toEqual(1302.07)
	})
})
