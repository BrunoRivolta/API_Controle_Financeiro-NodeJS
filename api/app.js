const express = require('express')
const swaggerUi = require('swagger-ui-express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const swaggerDocs = require('../swagger/swagger.json')

const app = express()

app.use(express.static('./front'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*") //aqui liberamos enderecos de onde podemos receber requisicoes, caso o endereco nao esteja listado (*)aqui teremos erro de policy cors
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	)
	next()
});

routes(app)

module.exports = app
