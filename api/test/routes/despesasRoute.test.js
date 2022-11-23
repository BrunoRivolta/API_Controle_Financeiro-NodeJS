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
					'email': 'usuario@deteste.com',
					'senha': '123456'
				}
			)
			.expect(204)
			
		token = resposta.headers.authorization
	})
})

describe('GET em /despesas', () => {
	it('Deve retornar uma lista de despesas', async () => {
		const resposta = await request(app)
			.get('/despesas')
			.expect(200) 

		primeiroId = resposta.body[0].id
		expect(resposta.body[0].descricao).toEqual('Mercado')
	})
})

describe('GET em /despesas/id', () => {
	it('Deve retornar uma despesa', async () => {
		const resposta = await request(app)
			.get(`/despesas/${primeiroId}`)
			.expect(200)

		expect(resposta.body.valor).toEqual(152.21)
	})
})

describe('GET em /despesas?busca=Busca', () => {
	it('Deve retornar despesas buscadas por uma descrição', async () => {
		const resposta = await request(app)
			.get('/despesas?busca=Farmacia')
			.expect(200)

		expect(resposta.body[0].descricao).toEqual('Farmacia')
	})
})

describe('GET em /despesas/mes/ano', () => {
	it('Deve retornar uma lista de despesas de um mes e ano especifico', async () => {
		const resposta = await request(app)
			.get('/despesas/07/2022')
			.expect(200)

		expect(resposta.body[2].descricao).toEqual('Conta Internet')
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
					valor: 11,
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
		expect(resposta.body.message).toEqual(`A despesa ID: ${id}, foi atualizada`)
	})
})

describe('DELETE em /despesa/id', () => {
	it('Deve apagar uma despesa', async () => {
		const resposta = await request(app)
			.delete(`/despesas/${id}`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)

		expect(resposta.body.message).toBe(`id ${id} deletado`)		
	})
})

describe('POST em /despesas/id/restaura', () => {
	it('Restaura uma despesa deletada', async () => {
		const resposta = await request(app)
			.post(`/despesas/${id}/restaura`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)

		expect(resposta.body.message).toEqual(`A despesa id: ${id} foi restaurada com sucesso!`)
	})
})
