// reservaRoutes.js
const express = require('express')
const router = express.Router()
const {
  getReservasPorFecha,
  reservarCancha,
  getReservasDelUsuario,
  getReservasHoy          //New
} = require('../controllers/reservaController')
const {
  verificarReservasActivas,
} = require('../middlewares/verificarReservasActivasMiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')

// Ruta para obtener reservas del usuario
router.get('/', authMiddleware, getReservasDelUsuario)
// Ruta para obtener reservas por fecha
router.get('/:fecha', authMiddleware, getReservasPorFecha)
// Ruta para realizar una reserva sabiendo sus reservas activas
router.post('/', authMiddleware, verificarReservasActivas, reservarCancha)
// Ruta para obtener reservas de hoy
router.get('/hoy', authMiddleware, getReservasHoy)    //New

//router.get('/verifica', authMiddleware, verificarReservasActivas)

module.exports = router






