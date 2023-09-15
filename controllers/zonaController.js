const { PrismaClient } = require('@prisma/client')
const zonaClient = new PrismaClient().zona

const getZonas = async (req, res) => {
  try {
    const zonas = await zonaClient.findMany({
      include: {
        cancha: true,
      },
    })
    return res.status(200).json(zonas)
  } catch (error) {
    throw new Error(error)
  }
}

const getZona = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const zona = await zonaClient.findUnique({
      where: {
        cod_zona: id,
      },
    })

    return res.status(200).json(zona)
  } catch (error) {
    throw new Error(error)
  }
}

const createZona = async (req, res) => {
  const { descripcionZona } = req.body
  try {
    const zona = await zonaClient.create({
      data: {
        descripcion: descripcionZona,
      },
    })

    return res.status(200).json(zona)
  } catch (error) {
    throw new Error(error)
  }
}

const updateZona = async (req, res) => {
  const { descripcionZona } = req.body
  const id = Number(req.params.id)
  try {
    const zona = await zonaClient.update({
      where: {
        cod_zona: id,
      },
      data: {
        descripcion: descripcionZona,
      },
    })

    return res.status(200).json(zona)
  } catch (error) {
    throw new Error(error)
  }
}

const deleteZona = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const zona = zonaClient.delete({
      where: {
        cod_zona: id,
      },
    })

    return res.status(200).json(zona)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  getZonas,
  getZona,
  createZona,
  updateZona,
  deleteZona,
}
