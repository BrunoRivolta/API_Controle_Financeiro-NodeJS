const { Router } = require('express')
const ReceitasController = require('../controllers/receitasController')
const middlewaresAutenticacao = require('../config/middlewares-autenticacao')

const router = Router()

router
	.get('/receitas', middlewaresAutenticacao.bearer, ReceitasController.listaReceitas)
	.get('/receitas/:mes/:ano', middlewaresAutenticacao.bearer, ReceitasController.listaReceitasPorMesEAno)
	.post('/receitas', middlewaresAutenticacao.bearer,  ReceitasController.adicionarReceita)
	.put('/receitas/:id', middlewaresAutenticacao.bearer,  ReceitasController.atualizaReceita)
	.delete('/receitas/:id', middlewaresAutenticacao.bearer,  ReceitasController.apagaReceita)

module.exports = router


