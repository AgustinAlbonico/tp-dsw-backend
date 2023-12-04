const { PrismaClient } = require('@prisma/client')
const reservaClient = new PrismaClient().reserva

const getReservasPorFecha = async (req, res) => {
  const fechaParam = req.params.fecha
  const fecha = new Date(fechaParam)
  if (fecha.toString() === 'Invalid Date')
    return res.status(400).json('Fecha ingresada no correcta')
  try {
    const reservas = await reservaClient.findMany({
      where: {
        fecha_turno: fecha,
      },
    })
    return res.status(200).json(reservas)
  } catch (error) {
    return res.status(500).json(error)
  }
}

const getReservasDelUsuario = async (req, res) => {
  const { page } = req.query
  const { id_usuario } = req.user

  const limit = 10
  let pagina = parseInt(page) ? parseInt(page) : 1
  const skip = (pagina - 1) * limit

  try {
    const reservas = await reservaClient.findMany({
      take: limit,
      skip,
      where: {
        id_usuario,
      },
      include: {
        cancha: true,
      },
    })
    return res.status(200).json(reservas)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

const verificarReservasActivas = async () => {
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

  if (cant_activas > 3) return res.status(200)
}

//Reservar una cancha para un usuario
const reservarCancha = async (req, res) => {
  const { id_usuario } = req.user
  const datosReserva = { ...req.body, id_usuario }

  console.log(datosReserva)

  console.log(req.excede)

  //Cambio el tipo de dato de la fecha_turno
  datosReserva.fecha_turno = new Date(datosReserva.fecha_turno)

  //Cambio el tipo de dato de la hora_turno
  const generoHoraTurno = (hora) => {
    let x = new Date()
    hora = hora.split(':')[0] - 3
    x.setHours(hora)
    x.setMinutes(0)
    x.setSeconds(0)
    x.setMilliseconds(0)
    return x
  }
  datosReserva.hora_turno = generoHoraTurno(datosReserva.hora_turno)

  try {
    const reserva = await reservaClient.createMany({
      data: datosReserva,
    })

    return res.status(200).json(reserva)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Error al registrar la reserva' })
  }
}

// Obtener reservas de un cliente en específico       //NEW
const getReservasCliente = async (req, res) => {
  try {
    const { idCliente } = req.params;
    const reservas = await reservaClient.findMany({
      where: {
        id_usuario: parseInt(idCliente),
      },
    });
    res.json(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las reservas del cliente' });
  }
};

// Obtener reservas de hoy                        //NEW
const getReservasHoy = async (req, res) => {
  try {
    const today = new Date();
    const reservas = await reservaClient.findMany({
      where: {
        fecha_turno: today.toISOString().split('T')[0],
      },
    });
    res.json(reservas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las reservas de hoy' });
  }
};


module.exports = {
  getReservasPorFecha,
  getReservasDelUsuario,
  reservarCancha,
  verificarReservasActivas,
  getReservasCliente,         //NEW
  getReservasHoy              //NEW
}
