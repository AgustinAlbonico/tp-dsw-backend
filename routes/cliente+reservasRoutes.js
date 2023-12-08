
const express = require('express');
const router = express.Router();
const { getReservasCliente } = require('../controllers/cliente+reservasController'); 

router.get('/reservas/cliente/:idCliente', async (req, res) => {
  await getReservasCliente(req, res);
});

module.exports = router;
