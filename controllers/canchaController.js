const { PrismaClient } = require('@prisma/client')
const canchaClient = new PrismaClient().cancha
const zonaClient = new PrismaClient().zona
const tipoCanchaClient = new PrismaClient().tipo_cancha

const getCanchas = async (req, res) => {
  try {
    const canchas = await canchaClient.findMany({
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

const getCanchasDisponibles = async (req, res) => {
  const { zona, tipoCancha, fecha } = req.query
  try {
    const zon = await zonaClient.findFirst({
      where: {
        descripcion: zona,
      },
    })
    const tipo = await tipoCanchaClient.findFirst({
      where: {
        descripcion: tipoCancha,
      },
    })
    const canchas = await canchaClient.findMany({
      where: {
        zona: zon,
        tipo_cancha: tipo,
      },
    })
    return res.status(200).json(canchas)
  } catch (error) {
    throw new Error(error)
  }
}

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
    })
    return res.status(200).json(canchas)
  } catch (error) {
    throw new Error(error)
  }
}

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
  } = req.body
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
    })

    return res.status(200).json(cancha)
  } catch (error) {
    throw new Error(error)
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
  const id = req.params.id
  try {
    const cancha = await canchaClient.delete({
      where: { nro_cancha: id },
    })

    return res.status(200).json(cancha)
  } catch (error) {
    throw new Error(error)
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
