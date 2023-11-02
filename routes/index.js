const router = require('express').Router()

const reservaRoutes = require('./reservaRoutes')
const usuarioRoutes = require('./usuarioRoutes')
const zonaRoutes = require('./zonaRoutes')
const canchaRoutes = require('./canchaRoutes')
const tipoCanchaRoutes = require('./tipoCanchaRoutes')

router.use('/reserva', reservaRoutes)
router.use('/user', usuarioRoutes)
router.use('/zona', zonaRoutes)
router.use('/cancha', canchaRoutes)
router.use('/tipo_cancha', tipoCanchaRoutes)

module.exports = router
