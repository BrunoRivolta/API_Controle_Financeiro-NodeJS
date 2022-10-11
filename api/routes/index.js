const bodyParser = require('body-parser')
const categorias = require('./categoriaRoute')
const despesas = require('./despesasRoute')
const receitas = require('./receitasRoute')
const relatorio = require('./relatoriosRoute')

module.exports = app => {
	app.use(bodyParser.json())  //express vai isar o body-parser para converter dados em json
	app.use(categorias)
	app.use(despesas)
	app.use(receitas)
	app.use(relatorio)
}