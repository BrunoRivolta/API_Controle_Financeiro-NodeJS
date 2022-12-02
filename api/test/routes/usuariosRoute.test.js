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

let usuarioCriado
let accessToken

function numero () {
	const n = Math.floor(Math.random() * 99999);
	return n
}

describe('POST em /usuarios/', () => {
	it('Deve criar uma novo usuario', async () => {
		const resposta = await request(app)
			.post('/usuarios')
			.send( 
				{
					email: `teste${numero()}@test.com`,
					nome: 'UsuarioTeste',
					senha: '123456',
					emailVerificado: true
				}
			)
			.expect(201)

			usuarioCriado = resposta.body
			expect(resposta.body.nome).toEqual('UsuarioTeste')
	})
})

describe('POST em /usuarios/login', () => {
	it('Deve impedir login com dados (email/senha) errados', async () => {
		const resposta = await request(app)
			.post('/usuarios/login')
			.send(
				{
					'email': `xxxxx@xxxx.com`,
					'senha': 'xxxxxx'
				}
			)
			.expect(401)
			
			expect(resposta.body.erro).toEqual('Email ou senha invalidos')
	})

	it('Deve fazer o login na aplicação e gerar um accessToken', async () => {
		const resposta = await request(app)
			.post('/usuarios/login')
			.send(
				{
					'email': `${usuarioCriado.email}`,
					'senha': '123456'
				}
			)
			.expect(200)
			
			accessToken = resposta.headers.authorization
	})
})

describe('POST em /usuarios/atualiza_refresh', () => {
	it('Deve recusar um refresToken invalido', async () => {
		const resposta = await request(app)
			.post(`/usuarios/atualiza_refresh`)
			.send({ refreshToken: "xxxxxxxx" })
			.expect(401)

		expect(resposta.body.erro).toEqual("Refresh Token é invalido!")
	})
})

describe('GET em /usuarios/verifica_email/:token', () => {
	it('Deve recusar um token de verificação de e-mail invalido', async () => {
		const resposta = await request(app)
			.get(`/usuarios/verifica_email/eyJhbGciOiJIUzI1`)
			.expect(401)

		expect(resposta.body.erro).toEqual("jwt malformed")
	})
})

describe('GET em /usuarios/restaura_usuario/:token', () => {
	it('Deve recusar um token de recuparação de usuário invalido', async () => {
		const resposta = await request(app)
			.get('/usuarios/restaura_usuario/eyJhbGciOiJIUz')
			.expect(401)

		expect(resposta.body.erro).toEqual("jwt malformed")
	})
})

describe('PUT em /usuarios/', () => {
	it('Deve atualizar um usuario', async () => {
		const resposta = await request(app)
			.put(`/usuarios/`)
			.set('Authorization', 'Bearer ' + accessToken)
			.send({ nome: 'Apagar Registro' })
			.expect(200)

		expect(resposta.body.message).toEqual('Atualizado com sucesso!')
	})
})

describe('GET em /usuarios/logout', () => {
	it('Deve impedir o logout que não contenha accessToken e refreshToken', async () => {
		const resposta = await request(app)
			.get('/usuarios/logout')
			.expect(401)

		expect(resposta.body.erro).toEqual("Refresh Token não enviado!")
	})
})

describe('DELETE em /usuarios/', () => {
	it('Deve apagar um usuario', async () => {
		const resposta = await request(app)
			.delete(`/usuarios/`)
			.set('Authorization', 'Bearer ' + accessToken)
			.expect(200)

		expect(resposta.body.message).toEqual('Usuario apagado')
	})
})

