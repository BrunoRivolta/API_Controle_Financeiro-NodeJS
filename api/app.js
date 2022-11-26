const bodyParser = require('body-parser')
const express = require('express')
const routes = require('./routes')

const app = express()
app.use(bodyParser.json())

routes(app)

module.exports = app
