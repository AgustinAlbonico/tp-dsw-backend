const { PrismaClient } = require('@prisma/client')
const userClient = new PrismaClient().usuario
const jwt = require('jsonwebtoken')

//Misma funcion pero con cookies
const authMiddleware = async (req, res, next) => {
  let token = req.cookies.access_token
  if (!token) {
    throw new Error('No hay token de autenticacion, logueate por favor')
  }
  try {
    const { id_usuario } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userClient.findUnique({
      where: { id_usuario },
    })
    if (user) {
      //Paso el user a la request
      req.user = user
      next()
    }
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = { authMiddleware }
