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

describe('GET em /usuarios', () => {
	it('GET em /usuarios - Deve retornar uma lista de usuarios', async () => {
		const resposta = await request(app)
			.get('/usuarios')
			.expect(200) 

		primeiroId = resposta.body[0].id
		expect(resposta.body[0].nome).toEqual('Jest')
	})
})

describe('GET em /usuarios/id', () => {
	it('GET em /usuarios/id - Deve retornar um usuario', async () => {
		const resposta = await request(app)
			.get(`/usuarios/${primeiroId}`)
			.expect(200)

		expect(resposta.body.email).toEqual('usuario@deteste.com')
	})
})

let id

describe('POST em /usuarios/', () => {
	it('Deve adicionar uma novo usuario', async () => {
		const resposta = await request(app)
			.post('/usuarios')
			.send( 
				{
					'email': 'teste@teste.com',
					'nome': 'Usuario Teste',
					'senha': '123456'
				}
			)
			.expect(200)

		id = resposta.body.id
	})
})

describe('PUT em /usuarios/id', () => {
	it('Deve atualizar um usuario', async () => {
		const resposta = await request(app)
			.put(`/usuarios/${id}`)
			.set('Authorization', 'Bearer ' + token)
			.send({ nome: 'usuario teste atualizado' })

		expect(resposta.body.message).toEqual(`O usuario ID: ${id}, foi atualizada`)
	})
})

describe('DELETE em /usuario/id', () => {
	it('Deve apagar um usuario', async () => {
		const resposta = await request(app)
			.delete(`/usuarios/${id}`)
			.set('Authorization', 'Bearer ' + token)

			.expect(200)

		expect(resposta.body.message).toBe(`Usuario id ${id} deletado junto com todos seus registros`)		
	})
})

describe('POST em /usuarios/id/restaura', () => {
	it('Restaura um usuario deletado', async () => {
		const resposta = await request(app)
			.post(`/usuarios/${id}/restaura`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)

		expect(resposta.body.message).toEqual(`o usuario id: ${id} foi restaurada com sucesso!`)
	})
})

