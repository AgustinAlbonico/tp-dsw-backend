// ClienteReservasRoutes.js
const express = require('express');
const router = express.Router();

const {busquedaUser} = require('../controllers/ClienteReservasController')

router.post('/busqueda', busquedaUser)

module.exports = router;

