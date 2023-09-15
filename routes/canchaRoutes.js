const Router = require('express').Router()

const {
  getCanchas,
  getCancha,
  createCancha,
  deleteCancha,
  updateCancha,
  getCanchasDisponibles,
} = require('../controllers/canchaController')

//Router.get('/', getCanchas)
Router.get('/:id', getCancha)
Router.get('/', getCanchasDisponibles)

module.exports = Router
