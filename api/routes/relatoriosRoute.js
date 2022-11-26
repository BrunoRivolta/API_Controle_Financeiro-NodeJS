const { Router } = require('express')
const RelatorioController = require('../controllers/relatorioController')

const router = Router()

router
	.get('/relatorio', RelatorioController.listaRelatorios)
	.get('/relatorio/:mes/:ano', RelatorioController.listaRelatorioPorMesEAno)

module.exports = router


