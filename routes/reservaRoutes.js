const express = require('express');
const router = express.Router();
const {listarReservaView,agregarReserva, agregarReservaView, listarReservaPorUsuario} = require('../controllers/reservaController.js');
var moment = require('moment');

//get
router.get('/agregarReserva', function (req, res) {
    res.render("agregarReserva", {cookie: req.cookies.user, moment:moment});
});
router.get('/modificarReserva', );
router.get('/eliminarReserva', );
router.get('/listarReservas', listarReservaView);
router.get('/listarReservasdeUser', listarReservaPorUsuario);


//post
router.post('/agregarReserva', agregarReserva);

module.exports= router;