const { Router } = require('express') 
const UsuariosController = require('../controllers/usuariosController')
const middlewaresAutenticacao = require('../config/middlewares-autenticacao')

const router = Router()

router
	.post('/usuarios/login', middlewaresAutenticacao.local, UsuariosController.login)
	.get('/usuarios/logout', middlewaresAutenticacao.bearer ,UsuariosController.logout)
	.get('/usuarios', UsuariosController.listaUsuarios)
	.get('/usuarios/:id', UsuariosController.listaUsuarioPorId)
	.post('/usuarios', UsuariosController.adicionarUsuario)
	.post('/usuarios/:id/restaura', middlewaresAutenticacao.bearer, UsuariosController.restauraUsuario)
	.put('/usuarios/:id', middlewaresAutenticacao.bearer, UsuariosController.atualizaUsuario)
	.delete('/usuarios/:id', middlewaresAutenticacao.bearer, UsuariosController.apagaUsuario)

module.exports = router

