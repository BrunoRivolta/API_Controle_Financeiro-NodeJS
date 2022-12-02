const { Router } = require('express')
const RelatorioController = require('../controllers/relatorioController')
const middlewaresAutenticacao = require('../config/middlewares-autenticacao')

const router = Router()

router
	.get('/relatorio', middlewaresAutenticacao.bearer, RelatorioController.listaRelatorios)
	.get('/relatorio/:mes/:ano', middlewaresAutenticacao.bearer, RelatorioController.listaRelatorioPorMesEAno)

module.exports = router


