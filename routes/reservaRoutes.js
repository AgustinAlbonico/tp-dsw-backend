const express = require('express');
const router = express.Router();
const {
  getReservasPorFecha,
  reservarCancha,
  getReservasDelUsuario,
  getReservasHoy,
  cancelarReserva,
} = require('../controllers/reservaController');
const {
  verificarReservasActivas,
} = require('../middlewares/verificarReservasActivasMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/hoy', getReservasHoy);

router.get('/', authMiddleware, getReservasDelUsuario);
router.get('/:fecha', authMiddleware, getReservasPorFecha);
router.post('/', authMiddleware, verificarReservasActivas, reservarCancha);
//router.get('/verifica', authMiddleware, verificarReservasActivas)

router.put('/:id', authMiddleware, cancelarReserva);

module.exports = router;
