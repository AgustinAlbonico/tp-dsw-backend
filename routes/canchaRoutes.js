const Router = require('express').Router();

const {
  getCanchas,
  getCancha,
  createCancha,
  deleteCancha,
  updateCancha,
  getCanchasDisponibles,
} = require('../controllers/canchaController');
const { adminMiddleware } = require('../middlewares/adminMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  verificarReservasActivas,
} = require('../middlewares/verificarReservasActivasMiddleware');

Router.get('/disponibles', authMiddleware, getCanchasDisponibles);

Router.get("/", getCanchas);
Router.get('/:id', getCancha);
Router.delete('/:id', authMiddleware, adminMiddleware ,deleteCancha);
Router.post('/', authMiddleware, adminMiddleware, createCancha);

module.exports = Router;
