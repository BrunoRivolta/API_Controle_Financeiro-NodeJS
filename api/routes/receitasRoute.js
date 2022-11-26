const { Router } = require('express')
const ReceitasController = require('../controllers/receitasController')
const middlewaresAutenticacao = require('../config/middlewares-autenticacao')

const router = Router()

router
	.get('/receitas', ReceitasController.listaReceitas)
	.get('/receitas/:id', ReceitasController.listaReceitaPorId)
	.get('/receitas/:mes/:ano', ReceitasController.listaReceitasPorMesEAno)
	.post('/receitas', middlewaresAutenticacao.bearer,  ReceitasController.adicionarReceita)
	.post('/receitas/:id/restaura', middlewaresAutenticacao.bearer,  ReceitasController.restauraReceita)
	.put('/receitas/:id', middlewaresAutenticacao.bearer,  ReceitasController.atualizaReceita)
	.delete('/receitas/:id', middlewaresAutenticacao.bearer,  ReceitasController.apagaReceita)

module.exports = router


