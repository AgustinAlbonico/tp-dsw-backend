const Router = require('express').Router()

const {
  getTipos,
  getTipo,
  createTipo,
  deleteTipo,
  updateTipo,
} = require('../controllers/tipoCanchaController')

Router.get('/', getTipos)
Router.get('/:id', getTipo)
Router.post('/', createTipo)
Router.put('/:id', updateTipo)
Router.delete('/:id', deleteTipo)

module.exports = Router
