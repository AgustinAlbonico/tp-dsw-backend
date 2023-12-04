// reservaRoutes.js
const express = require('express')
const router = express.Router()
const {
  getReservasPorFecha,
  reservarCancha,
  getReservasDelUsuario,
  getReservasCliente,     //New
  getReservasHoy          //New
} = require('../controllers/reservaController')
const {
  verificarReservasActivas,
} = require('../middlewares/verificarReservasActivasMiddleware')
const { authMiddleware } = require('../middlewares/authMiddleware')
const isAdminMiddleware = require('../middlewares/isAdminMiddleware') //New

// Ruta para obtener reservas del usuario
router.get('/', authMiddleware, getReservasDelUsuario)
// Ruta para obtener reservas por fecha
router.get('/:fecha', authMiddleware, getReservasPorFecha)
// Ruta para realizar una reserva sabiendo sus reservas activas
router.post('/', authMiddleware, verificarReservasActivas, reservarCancha)
// Ruta para obtener reservas de un cliente en específico
router.get('/reservas/cliente/:idCliente', authMiddleware, isAdminMiddleware, getReservasCliente)  //New
// Ruta para obtener reservas de hoy
router.get('/reservas/hoy', authMiddleware, isAdminMiddleware, getReservasHoy)    //New

//router.get('/verifica', authMiddleware, verificarReservasActivas)

module.exports = router






