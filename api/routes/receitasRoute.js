const { Router } = require('express')
const ReceitasController = require('../controllers/receitasController')

const router = Router()

router
	.get('/receitas', ReceitasController.listaReceitas)
	.get('/receitas/:id', ReceitasController.listaReceitaPorId)
	.get('/receitas/:mes/:ano', ReceitasController.listaReceitasPorMesEAno)
	.post('/receitas', ReceitasController.adicionarReceita)
	.put('/receitas/:id', ReceitasController.atualizaReceita)
	.delete('/receitas/:id', ReceitasController.apagaReceita)

module.exports = router


