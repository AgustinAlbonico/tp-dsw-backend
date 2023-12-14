const { PrismaClient } = require('@prisma/client');
const canchaClient = new PrismaClient().cancha;
const zonaClient = new PrismaClient().zona;
const tipoCanchaClient = new PrismaClient().tipo_cancha;
const { DateTime } = require('luxon');

const getCanchas = async (req, res) => {
  try {
    const canchas = await canchaClient.findMany({
      include: {
        zona: true,
        tipo_cancha: true,
      },
    });
    return res.status(200).json(canchas);
  } catch (error) {
    throw new Error(error);
  }
};

const getCanchasDisponibles = async (req, res) => {
  const { zona, tipoCancha, fecha, page } = req.query;

  const limit = 2;
  let pagina = parseInt(page) ? parseInt(page) : 1;
  const skip = (pagina - 1) * limit;

  let cod_zona = parseInt(zona);
  let cod_tipo = parseInt(tipoCancha);
  let fechaAux = new Date(fecha);
  fechaAux.setUTCHours(0, 0, 0, 0);
  const fechaFormateada = fechaAux.toISOString();

  try {
    //Traigo las canchas para un tipo, una zona y una fecha
    const canchas = await canchaClient.findMany({
      where: {
        cod_zona,
        cod_tipo,
      },
      take: limit,
      skip,
      include: {
        reserva: {
          where: {
            AND: [{ fecha_turno: fechaFormateada }, { estado: 'reservado' }],
          },
        },
      },
    });

    console.log(canchas[0].reserva);

    //Filtro por afuera de la query el dia de las reservas con el dia ingresado

    //Creo los horarios disponibles para cada cancha y la fecha ingresada
    function generarHorarios(horaInicio, horaFin) {
      const horarios = [];

      // Divide las horas y minutos
      const [inicioHora, inicioMinuto] = horaInicio.split(':');
      const [finHora, finMinuto] = horaFin.split(':');

      // Convierte las horas y minutos a números
      const horaInicioNum = parseInt(inicioHora, 10);
      const horaFinNum = parseInt(finHora, 10);

      // Inicializa la hora actual con la hora de inicio
      let horaActual = horaInicioNum;

      // Agrega horarios al array hasta que alcancemos la hora de fin
      while (horaActual < horaFinNum) {
        // Formatea la hora actual con dos dígitos y añade al array
        const horaFormateada = horaActual.toString().padStart(2, '0');
        horarios.push(`${horaFormateada}:${inicioMinuto}`);

        // Incrementa la hora actual en una hora
        horaActual++;

        // Si la hora actual llega a 24, reinicializa a 0 para manejar el cambio de día
        if (horaActual === 24) {
          horaActual = 0;
        }
      }

      // Agrega la última hora (horaFin) al array
      horarios.push(horaFin);

      return horarios;
    }

    //Function para transformar horario de mysql en hora formato 'HH:mm'
    function convertirHorario(horario) {
      let horaUtc = new Date(horario.toUTCString());

      // Obtén la hora y los minutos en formato HH:MM
      const hora = horaUtc.getUTCHours();
      const minutos = horaUtc.getUTCMinutes();
      return `${hora.toString().padStart(2, '0')}:${minutos
        .toString()
        .padStart(2, '0')}`;
    }

    canchas.forEach((cancha) => {
      let horaInicio = convertirHorario(cancha.horario_apertura);
      let horaFin = convertirHorario(cancha.horario_cierre);

      //Genero todos los horarios para la cancha dentro del horario de apertura y cierra
      cancha.horarios = generarHorarios(horaInicio, horaFin);

      //Cambio el formato de la fecha de las reservas de cada cancha
      cancha.reserva.forEach(
        (res) => (res.hora_turno = convertirHorario(res.hora_turno) + '')
      );

      //Filtro los horarios ya reservados para la fecha ingresada
      const horariosOcupados = cancha.reserva.map(
        (item) => item.hora_turno + ''
      );
      cancha.horarios = cancha.horarios.filter(
        (item) => !horariosOcupados.includes(item)
      );

      //Saco las reservas para no mandar info innecesaria al front
      delete cancha.reserva;
    });

    //console.log(canchas)

    return res.status(200).json(canchas);
  } catch (error) {
    throw new Error(error);
  }
};

const getCancha = async (req, res) => {
  try {
    const canchas = await canchaClient.findUnique({
      where: {
        nro_cancha: req.params,
      },
      include: {
        zona: true,
        tipo_cancha: true,
      },
    });
    return res.status(200).json(canchas);
  } catch (error) {
    throw new Error(error);
  }
};

const createCancha = async (req, res) => {
  const {
    descripcionCancha,
    costoTurno,
    calleCancha,
    nroCalle,
    horarioApertura,
    horarioCierre,
    codZona,
    codTipo,
  } = req.body;
  try {
    const cancha = await canchaClient.create({
      data: {
        calle: calleCancha,
        nro_calle: nroCalle,
        costo_por_turno: costoTurno,
        descripcion: descripcionCancha,
        horario_apertura: horarioApertura,
        horario_cierre: horarioCierre,
        cod_zona: codZona,
        cod_tipo: codTipo,
      },
    });

    return res.status(200).json(cancha);
  } catch (error) {
    throw new Error(error);
  }
};

const updateCancha = async (req, res) => {
  const id = req.params.id;
  const {
    descripcionCancha,
    costoTurno,
    calleCancha,
    nroCalle,
    horarioApertura,
    horarioCierre,
    codZona,
    codTipo,
  } = req.body;
  try {
    const cancha = await canchaClient.update({
      where: { nro_cancha: id },
      data: {
        calle: calleCancha,
        nro_calle: nroCalle,
        costo_por_turno: costoTurno,
        descripcion: descripcionCancha,
        horario_apertura: horarioApertura,
        horario_cierre: horarioCierre,
        cod_zona: codZona,
        cod_tipo: codTipo,
      },
    });

    return res.status(200).json(cancha);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCancha = async (req, res) => {
  const id = req.params.id;
  try {
    const cancha = await canchaClient.delete({
      where: { nro_cancha: id },
    });

    return res.status(200).json(cancha);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getCanchas,
  getCancha,
  createCancha,
  updateCancha,
  deleteCancha,
  getCanchasDisponibles,
};
