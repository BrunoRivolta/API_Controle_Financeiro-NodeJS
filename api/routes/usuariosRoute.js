const { Router } = require('express') 
const UsuariosController = require('../controllers/usuariosController')
const middlewaresAutenticacao = require('../config/middlewares-autenticacao')

const router = Router()

router
	.post('/usuarios/login', middlewaresAutenticacao.local, UsuariosController.login)
	.post('/usuarios/atualiza_refresh', middlewaresAutenticacao.refresh ,UsuariosController.login)
	.get('/usuarios/logout', [middlewaresAutenticacao.refresh, middlewaresAutenticacao.bearer] ,UsuariosController.logout)
	.get('/usuarios/verifica_email/:token', middlewaresAutenticacao.verificacaoEmail, UsuariosController.verificaEmail)
	.get('/usuarios/restaura_usuario/:token', middlewaresAutenticacao.verificacaoEmail, UsuariosController.restauraUsuario)
	.post('/usuarios', UsuariosController.adicionarUsuario)
	.put('/usuarios/', middlewaresAutenticacao.bearer, UsuariosController.atualizaUsuario) 
	.delete('/usuarios/', middlewaresAutenticacao.bearer, UsuariosController.apagaUsuario) 

module.exports = router


