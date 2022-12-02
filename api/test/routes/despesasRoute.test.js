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

let primeiroId
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

describe('GET em /despesas', () => {
	it('Deve retornar uma lista de despesas', async () => {
		const resposta = await request(app)
			.get('/despesas')
			.set('Authorization', 'Bearer ' + token)
			.expect(200) 

		primeiroId = resposta.body[0].id
		expect(resposta.body[0].descricao).toEqual('Mercado')
	})
})

describe('GET em /despesas?busca=Busca', () => {
	it('Deve retornar despesas buscadas por uma descrição', async () => {
		const resposta = await request(app)
			.get('/despesas?busca=Farmacia')
			.set('Authorization', 'Bearer ' + token)
			.expect(200)

		expect(resposta.body[0].descricao).toEqual('Farmacia')
	})
})

describe('GET em /despesas/mes/ano', () => {
	it('Deve retornar uma lista de despesas de um mes e ano especifico', async () => {
		const resposta = await request(app)
			.get('/despesas/11/2022')
			.set('Authorization', 'Bearer ' + token)
			.expect(200)

		expect(resposta.body[2].descricao).toEqual('Internet')
	})
})

let id

describe('POST em /despesas/', () => {
	it('Deve adicionar uma nova despesa', async () => {
		const resposta = await request(app)
			.post('/despesas')
			.set('Authorization', 'Bearer ' + token)
			.send( 
				{
					descricao: 'teste',
					valor: 0,
					data: '2022-07-08',
					categoria_id: 1, 
					usuario_id: 1
				}
			)
			.expect(200)

		id = resposta.body.id
	})
})

describe('PUT em /despesas/id', () => {
	it('Deve atualizar uma despespa', async () => {
		const resposta = await request(app)
			.put(`/despesas/${id}`)
			.send({ descricao: 'teste atualizado' })
			.set('Authorization', 'Bearer ' + token)

		expect(resposta.body.message).toEqual('Despesa Atualizada')
	})
})

describe('DELETE em /despesa/id', () => {
	it('Deve apagar uma despesa', async () => {
		const resposta = await request(app)
			.delete(`/despesas/${id}`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)

		expect(resposta.body.message).toBe('Despesa apagada')		
	})
})

