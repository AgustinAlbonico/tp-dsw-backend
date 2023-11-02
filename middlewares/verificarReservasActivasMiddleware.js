const { PrismaClient } = require('@prisma/client')
const reservaClient = new PrismaClient().reserva

const verificarReservasActivas = async (req, res, next) => {
  const { id_usuario } = req.user

  let cant_activas
  //Parte para verificar si un usuario tiene mas de tres reservas activas
  try {
    cant_activas = await reservaClient.count({
      where: {
        id_usuario,
        estado: 'reservado',
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Error del servidor' })
  }

  if (cant_activas < 3) {
    req.excede = false
    next()
  } else {
    return res.status(401).json({
      message: 'Usted ya posee 3 reservas activas',
      excede: true,
    })
  }
}

module.exports = { verificarReservasActivas }
