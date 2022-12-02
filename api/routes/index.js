const bodyParser = require('body-parser')
const despesas = require('./despesasRoute')
const receitas = require('./receitasRoute')
const relatorio = require('./relatoriosRoute')
const usuarios = require('./usuariosRoute')
const estrategiasAutenticacao = require('../config/estrategia-autenticacao')
const middlewaresAutenticacao = require('../config/middlewares-autenticacao')

module.exports = app => {
	app.use(bodyParser.json())
	app.use(despesas)
	app.use(receitas)
	app.use(relatorio)
	app.use(usuarios),
	estrategiasAutenticacao,
	middlewaresAutenticacao
}