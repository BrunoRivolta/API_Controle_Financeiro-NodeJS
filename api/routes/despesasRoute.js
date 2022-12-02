const { Router } = require('express') 
const DespesasController = require('../controllers/despesasController')
const middlewaresAutenticacao = require('../config/middlewares-autenticacao')

const router = Router()

router
	.get('/despesas', middlewaresAutenticacao.bearer, DespesasController.listaDespesas)
	.get('/despesas/:mes/:ano', middlewaresAutenticacao.bearer, DespesasController.listaDespesasPorMesEAno)
	.post('/despesas', middlewaresAutenticacao.bearer, DespesasController.adicionarDespesa)
	.put('/despesas/:id', middlewaresAutenticacao.bearer, DespesasController.atualizaDespesa)
	.delete('/despesas/:id', middlewaresAutenticacao.bearer, DespesasController.apagaDespesa)


module.exports = router


