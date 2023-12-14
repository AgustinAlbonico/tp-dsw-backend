// ClienteReservasRoutes.js
const { PrismaClient } = require('@prisma/client');
const userClient = new PrismaClient().usuario;

// busquedaUser
const busquedaUser = async (req, res) => {

  try {
    // Obtén el email del cuerpo de la solicitud
    const { email } = req.body;
    console.log (email)
    // Busco al usuario por email
    const user = await userClient.findUnique({
      where: { email },
      //include:{reserva}
    });
    console.log (user)
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};

module.exports = { busquedaUser };

