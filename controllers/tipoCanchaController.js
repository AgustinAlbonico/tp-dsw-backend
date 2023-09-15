const { PrismaClient } = require('@prisma/client')
const tipoCanchaClient = new PrismaClient().tipo_cancha

const getTipos = async (req, res) => {
  try {
    const tipos = await tipoCanchaClient.findMany({
      include: {
        cancha: true,
      },
    })
    return res.status(200).json(tipos)
  } catch (error) {
    throw new Error(error)
  }
}

const getTipo = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const tipo = await tipoCanchaClient.findUnique({
      where: {
        cod_tipo: id,
      },
    })

    return res.status(200).json(tipo)
  } catch (error) {
    throw new Error(error)
  }
}

const createTipo = async (req, res) => {
  const { descripcionTipo } = req.body
  try {
    const tipo = await tipoCanchaClient.create({
      data: {
        descripcion: descripcionTipo,
      },
    })

    return res.status(200).json(tipo)
  } catch (error) {
    throw new Error(error)
  }
}

const updateTipo = async (req, res) => {
  const { descripcionTipo } = req.body
  const id = Number(req.params.id)
  try {
    const tipo = await tipoCanchaClient.update({
      where: {
        cod_tipo: id,
      },
      data: {
        descripcion: descripcionTipo,
      },
    })

    return res.status(200).json(tipo)
  } catch (error) {
    throw new Error(error)
  }
}

const deleteTipo = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const tipo = tipoCanchaClient.delete({
      where: {
        cod_tipo: id,
      },
    })

    return res.status(200).json(tipo)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  getTipos,
  getTipo,
  createTipo,
  updateTipo,
  deleteTipo,
}
