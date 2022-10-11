const express = require('express')
const routes = require('./routes')

const app = express()
const port = 3000

routes(app) //achamando rotas de /api/routes/index.js

app.listen(port, () => console.log(`Servidor funcionando na porta ${port}`)) //ouvindo o servidor para dizer se esta ok se esta funcionando

module.exports = app