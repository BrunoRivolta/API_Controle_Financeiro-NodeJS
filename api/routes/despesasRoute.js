const { Router } = require('express') 
const DespesasController = require('../controllers/despesasController')

const router = Router()

router
	.get('/despesas', DespesasController.listaDespesas)
	.get('/despesas/:id', DespesasController.listaDespesaPorId)
	.get('/despesas/:mes/:ano', DespesasController.listaDespesasPorMesEAno)
	.post('/despesas', DespesasController.adicionarDespesa)
	.put('/despesas/:id', DespesasController.atualizaDespesa)
	.delete('/despesas/:id', DespesasController.apagaDespesa)


module.exports = router


