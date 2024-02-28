const { PrismaClient } = require('@prisma/client')
const canchaClient = new PrismaClient().cancha
const moment = require('moment')

const getCanchas = async (req, res) => {
  let { page } = req.query

  const limit = 2
  let pagina = parseInt(page) ? parseInt(page) : 1
  const skip = (pagina - 1) * limit
  try {
    const cantTotal = await canchaClient.count()

    const canchas = await canchaClient.findMany({
      take: limit,
      skip,
      include: {
        zona: true,
        tipo_cancha: true,
      },
    })

    const cantPaginas = Math.ceil(cantTotal / limit)

    return res.status(200).json({ canchas, cantPaginas })
  } catch (error) {
    throw new Error(error)
  }
}

const getCanchasDisponibles = async (req, res) => {
  let { zona, tipoCancha, fecha, page } = req.query

  const limit = 3
  let pagina = parseInt(page) ? parseInt(page) : 1
  const skip = (pagina - 1) * limit

  let cod_zona = parseInt(zona)
  let cod_tipo = parseInt(tipoCancha)
  let fechaAux = new Date(fecha)
  fechaAux.setUTCHours(0, 0, 0, 0)
  const fechaFormateada = fechaAux.toISOString()

  //Variables auxiliares para el filtrado de horarios
  let fecha_reserva = fecha.substring(0, fecha.length - 1)
  let fecha_hoy = moment().format('YYYY-MM-DD')
  let hora_ahora = moment().format('HH')

  try {
    const cantTotal = await canchaClient.count({
      where: {
        cod_zona,
        cod_tipo,
      },
    })

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
    })

    const cant = Math.ceil(cantTotal / limit)

    //Creo los horarios disponibles para cada cancha y la fecha ingresada
    function generarHorarios(horaInicio, horaFin) {
      const horarios = []

      // Divide las horas y minutos
      const [inicioHora, inicioMinuto] = horaInicio.split(':')
      const [finHora, finMinuto] = horaFin.split(':')

      // Convierte las horas y minutos a números
      let horaInicioNum = parseInt(inicioHora, 10)
      let horaFinNum = parseInt(finHora, 10)

      if(horaFinNum === 0) horaFinNum = 24;

      let horaActual;
      //Si la fecha de reserva es la misma que la del dia de hoy, no muestro los horarios de los turnos que ya pasaron
      if (fecha_reserva === fecha_hoy) {
        //Inicializa la hora con la proxima hora
        horaActual = Number(hora_ahora) + 1
      } else {
        // Inicializa la hora con la hora de inicio
        horaActual = horaInicioNum
      }

      let aux;
      if(horaActual < horaInicioNum) aux = horaInicioNum; else aux = horaActual;

      // Agrega horarios al array hasta que alcancemos la hora de fin
      while (aux < horaFinNum) {
          // Formatea la hora actual con dos dígitos y añade al array
          const horaFormateada = aux.toString().padStart(2, '0')
          horarios.push(`${horaFormateada}:${inicioMinuto}`)

          // Incrementa la hora actual en una hora
          aux++ 

          // Si la hora actual llega a 24, reinicializa a 0 para manejar el cambio de día
          if (aux === 24 && horaFinNum !== 24) {
            aux = 0
          }    
      }

      // Agrega la última hora (horaFin) al array
      horarios.push(horaFin)

      if (hora_ahora === horarios[horarios.length - 1].split(':')[0]) {
        horarios.pop()
      }

      return horarios
    }

    //Function para transformar horario de mysql en hora formato 'HH:mm'
    function convertirHorario(horario) {
      let horaUtc = new Date(horario.toUTCString())

      // Obtén la hora y los minutos en formato HH:MM
      const hora = horaUtc.getUTCHours()
      const minutos = horaUtc.getUTCMinutes()
      return `${hora.toString().padStart(2, '0')}:${minutos
        .toString()
        .padStart(2, '0')}`
    }

    canchas.forEach((cancha) => {
      let horaInicio = convertirHorario(cancha.horario_apertura)
      let horaFin = convertirHorario(cancha.horario_cierre)

      //Genero todos los horarios para la cancha dentro del horario de apertura y cierra
      cancha.horarios = generarHorarios(horaInicio, horaFin)

      //Cambio el formato de la fecha de las reservas de cada cancha
      cancha.reserva.forEach(
        (res) => (res.hora_turno = convertirHorario(res.hora_turno) + '')
      )

      //Filtro los horarios ya reservados para la fecha ingresada
      const horariosOcupados = cancha.reserva.map(
        (item) => item.hora_turno + ''
      )
      cancha.horarios = cancha.horarios.filter(
        (item) => !horariosOcupados.includes(item)
      )

      // //Saco las reservas para no mandar info innecesaria al front
      // delete cancha.reserva
    })

    return res.status(200).json({ canchas, cant })
  } catch (error) {
    throw new Error(error)
  }
}

const getCancha = async (req, res) => {
  let id = Number(req.params.id)
  try {
    const canchas = await canchaClient.findUnique({
      where: {
        nro_cancha: id,
      },
      include: {
        zona: true,
        tipo_cancha: true,
      },
    })
    return res.status(200).json(canchas)
  } catch (error) {
    throw new Error(error)
  }
}

const createCancha = async (req, res) => {
  let {
    calle,
    costo_por_turno,
    descripcion,
    nro_calle,
    horario_apertura,
    horario_cierre,
    cod_zona,
    cod_tipo,
  } = req.body
  //Convierto los params a los tipos correctos
  cod_zona = Number(cod_zona)
  cod_tipo = Number(cod_tipo)
  costo_por_turno = parseFloat(costo_por_turno)
  nro_calle = Number(nro_calle)

  const dateTimeStringApertura = `1970-01-01T${horario_apertura}:00`
  const dateTimeStringCierre = `1970-01-01T${horario_cierre}:00`

  horario_apertura = new Date(dateTimeStringApertura).toISOString()
  horario_cierre = new Date(dateTimeStringCierre).toISOString()

  try {
    const cancha = await canchaClient.create({
      data: {
        calle,
        nro_calle,
        costo_por_turno,
        descripcion,
        horario_apertura,
        horario_cierre,
        cod_zona,
        cod_tipo,
      },
    })

    return res.status(200).json(cancha)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

const updateCancha = async (req, res) => {
  const id = req.params.id
  const {
    descripcionCancha,
    costoTurno,
    calleCancha,
    nroCalle,
    horarioApertura,
    horarioCierre,
    codZona,
    codTipo,
  } = req.body
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
    })

    return res.status(200).json(cancha)
  } catch (error) {
    throw new Error(error)
  }
}

const deleteCancha = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const cancha = await canchaClient.delete({
      where: { nro_cancha: id },
    })

    return res.status(200).json(cancha)
  } catch (error) {
    return res.status(500).json(erro)
  }
}

module.exports = {
  getCanchas,
  getCancha,
  createCancha,
  updateCancha,
  deleteCancha,
  getCanchasDisponibles,
}
