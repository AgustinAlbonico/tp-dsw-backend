const Router = require('express').Router();

const {
  getCanchas,
  getCancha,
  createCancha,
  deleteCancha,
  updateCancha,
  getCanchasDisponibles,
} = require('../controllers/canchaController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  verificarReservasActivas,
} = require('../middlewares/verificarReservasActivasMiddleware');

//Router.get("/", getCanchas);
Router.get('/:id', getCancha);
Router.get('/', authMiddleware, getCanchasDisponibles);

module.exports = Router;
