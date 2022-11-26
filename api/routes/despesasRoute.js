const { Router } = require('express') 
const DespesasController = require('../controllers/despesasController')
const middlewaresAutenticacao = require('../config/middlewares-autenticacao')

const router = Router()

router
	.get('/despesas', DespesasController.listaDespesas)
	.get('/despesas/:id', DespesasController.listaDespesaPorId)
	.get('/despesas/:mes/:ano', DespesasController.listaDespesasPorMesEAno)
	.post('/despesas', middlewaresAutenticacao.bearer, DespesasController.adicionarDespesa)
	.post('/despesas/:id/restaura', middlewaresAutenticacao.bearer, DespesasController.restauraDespesa)
	.put('/despesas/:id', middlewaresAutenticacao.bearer, DespesasController.atualizaDespesa)
	.delete('/despesas/:id', middlewaresAutenticacao.bearer, DespesasController.apagaDespesa)


module.exports = router


