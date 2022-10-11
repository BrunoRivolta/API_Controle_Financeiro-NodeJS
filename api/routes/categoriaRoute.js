const { Router } = require('express') //o Router é uma biblioteca do express
const CategoriaController = require('../controllers/categoriaController')

const router = Router()

router.get('/categorias', CategoriaController.listaCategoria)

module.exports = router


