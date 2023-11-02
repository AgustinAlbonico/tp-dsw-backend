const express = require('express')
const router = express.Router()
const {
  getReservasPorFecha,
  reservarCancha,
} = require('../controllers/reservaController')
const {
  verificarReservasActivas,
} = require('../middlewares/verificarReservasActivasMiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.get('/:fecha', authMiddleware, getReservasPorFecha)
router.post('/', authMiddleware, verificarReservasActivas, reservarCancha)
//router.get('/verifica', authMiddleware, verificarReservasActivas)

module.exports = router
