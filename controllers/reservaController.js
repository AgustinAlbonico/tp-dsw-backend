const { PrismaClient } = require('@prisma/client');
const { param } = require('../routes/reservaRoutes');
const reservaClient = new PrismaClient().reserva;

const getReservasPorFecha = async (req, res) => {
  const fechaParam = req.params.fecha;
  const fecha = new Date(fechaParam);
  if (fecha.toString() === 'Invalid Date')
    return res.status(400).json('Fecha ingresada no correcta');
  try {
    const reservas = await reservaClient.findMany({
      where: {
        fecha_turno: fecha,
      },
    });
    return res.status(200).json(reservas);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getReservasDelUsuario = async (req, res) => {
  const { page } = req.query;
  const { id_usuario } = req.user;

  const limit = 5;
  let pagina = parseInt(page) ? parseInt(page) : 1;
  const skip = (pagina - 1) * limit;

  try {
    const cantTotal = await reservaClient.count({ where: { id_usuario } });

    const reservas = await reservaClient.findMany({
      take: limit,
      skip,
      where: {
        id_usuario,
      },
      include: {
        cancha: true,
      },
      orderBy: [
        { estado: 'desc' },
        { fecha_turno: 'desc' },
        { hora_turno: 'desc' },
      ],
    });

    const cant = Math.ceil(cantTotal / limit);

    console.log(cantTotal / limit);
    console.log(cant);

    return res.status(200).json({ reservas, cant });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const verificarReservasActivas = async () => {
  const { id_usuario } = req.user;

  let cant_activas;
  //Parte para verificar si un usuario tiene mas de tres reservas activas
  try {
    cant_activas = await reservaClient.count({
      where: {
        id_usuario,
        estado: 'reservado',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error del servidor' });
  }

  if (cant_activas > 3) return res.status(200);
};

//Reservar una cancha para un usuario
const reservarCancha = async (req, res) => {
  const { id_usuario } = req.user;
  const datosReserva = { ...req.body, id_usuario };

  console.log(datosReserva);

  console.log(req.excede);

  //Cambio el tipo de dato de la fecha_turno
  datosReserva.fecha_turno = new Date(datosReserva.fecha_turno);

  //Cambio el tipo de dato de la hora_turno
  const generoHoraTurno = (hora) => {
    let x = new Date();
    hora = hora.split(':')[0] - 3;
    x.setHours(hora);
    x.setMinutes(0);
    x.setSeconds(0);
    x.setMilliseconds(0);
    return x;
  };
  datosReserva.hora_turno = generoHoraTurno(datosReserva.hora_turno);

  try {
    const reserva = await reservaClient.createMany({
      data: datosReserva,
    });

    return res.status(200).json(reserva);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error al registrar la reserva' });
  }
};

const getReservasHoy = async (req, res) => {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let tomorrow = today;
  tomorrow.setDate(tomorrow.getDate() + 1);
  console.log(today);
  console.log(tomorrow);
  try {
    const reservasHoy = await reservaClient.findMany({
      where: {
        fecha_hora_reserva: { gte: today },
      },
    });
    console.log(reservasHoy);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const cancelarReserva = async (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  try {
    const reserva = await reservaClient.updateMany({
      where: {
        nro_reserva: id,
      },
      data: {
        estado: 'cancelado',
      },
    });
    res.status(200).json(reserva);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  getReservasPorFecha,
  getReservasDelUsuario,
  reservarCancha,
  verificarReservasActivas,
  getReservasHoy,
  cancelarReserva,
};
