const http = require('http');
const app = require('./api/app')
const endereco = process.env.BASE_URL

const regex = /[0-9]+$/gm

const port = (regex.exec(endereco))[0]

http.createServer(app).listen(port, function() {
	console.log(`Servidor funcionando na porta ${port}`)
	console.log(`Acesse: http://${endereco}`)
});
