const Router = require('express').Router()

const {
  createZona,
  deleteZona,
  getZona,
  getZonas,
  updateZona,
} = require('../controllers/zonaController.js')

Router.get('/', getZonas)
Router.get('/:id', getZona)
Router.post('/', createZona)
Router.put('/', updateZona)
Router.delete('/:id', deleteZona)

module.exports = Router
