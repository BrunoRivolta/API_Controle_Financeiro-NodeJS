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
			.expect(200)
			
		token = resposta.headers.authorization
	})
})

describe('GET em /receitas', () => {
	it('Deve retornar uma lista de receitas', async () => {
		const resposta = await request(app)
			.get('/receitas')
			.expect(200) 

		primeiroId = resposta.body[0].id
		expect(resposta.body[0].descricao).toEqual('Salario')
	})
})

describe('GET em /receitas/id', () => {
	it('Deve retornar uma despesa', async () => {
		const resposta = await request(app)
			.get(`/receitas/${primeiroId}`)
			.expect(200)

		expect(resposta.body.valor).toEqual(800.8)
	})
})


describe('GET em /receitas?busca=Busca', () => {
	it('Deve retornar receitas buscadas por uma descrição', async () => {
		const resposta = await request(app)
			.get('/receitas?busca=Adiant')
			.expect(200)


		expect(resposta.body[0].descricao).toEqual('Adiantamento')
	})
})

describe('GET em /receitas/mes/ano', () => {
	it('Deve retornar uma lista de receitas de um mes e ano especifico', async () => {
		const resposta = await request(app)
			.get('/receitas/07/2022')
			.expect(200)

		expect(resposta.body[2].descricao).toEqual('Vendas')
	})
})

let id

describe('POST em /receitas/', () => {
	it('Deve adicionar uma nova receita', async () => {
		const resposta = await request(app)
			.post('/receitas')
			.set('Authorization', 'Bearer ' + token)
			.send( 
				{
					descricao: 'teste',
					valor: 0,
					data: '2022-07-08',
					usuario_id: 1
				}
			)
			.expect(200)

		id = resposta.body.id
	})
})

describe('PUT em /receitas/id', () => {
	it('Deve atualizar uma receita', async () => {
		const resposta = await request(app)
			.put(`/receitas/${id}`)
			.set('Authorization', 'Bearer ' + token)
			.send({ descricao: 'teste atualizado' })
		expect(resposta.body.message).toEqual(`A despesa ID: ${id}, foi atualizada`)
	})
})

describe('DELETE em /receitas/id', () => {
	it('Deve apagar uma receita', async () => {
		const resposta = await request(app)
			.delete(`/receitas/${id}`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)

		expect(resposta.body.message).toBe(`id ${id} deletado`)		
	})
})

describe('POST em /receitas/id/restaura', () => {
	it('Restaura uma receita deletada', async () => {
		const resposta = await request(app)
			.post(`/receitas/${id}/restaura`)
			.set('Authorization', 'Bearer ' + token)
			.expect(200)

		expect(resposta.body.message).toEqual(`A receita id: ${id} foi restaurada com sucesso!`)
	})

})
