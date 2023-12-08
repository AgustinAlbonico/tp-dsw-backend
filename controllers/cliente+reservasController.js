const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getReservasCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;

    // Se obtienen las reservas del cliente
    const reservas = await prisma.reserva.findMany({
      where: {
        id_usuario: parseInt(idCliente),
      },
      include: {
        cancha: {
          include: {
            tipo_cancha: true, // Incluye los datos del tipo de cancha asociado a la cancha
          },
        },
      },
    });

    // Se obtienen los datos del cliente
    const cliente = await prisma.usuario.findOne({
      where: {
        id_usuario: parseInt(idCliente),
      },
    });

    // Verifica si el cliente existe
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Devuelve ambas informaciones al frontend
    res.json({ reservas, cliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las reservas del cliente' });
  }
};

module.exports = { getReservasCliente };

