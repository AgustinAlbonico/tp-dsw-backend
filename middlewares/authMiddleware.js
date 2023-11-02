const { PrismaClient } = require('@prisma/client')
const userClient = new PrismaClient().usuario
const jwt = require('jsonwebtoken')

//Misma funcion pero con cookies
const authMiddleware = async (req, res, next) => {
  let token = req.cookies.access_token
  if (!token) {
    return res.status(400).json({ message: 'Necesitas iniciar sesion' })
  }
  try {
    const { id_usuario } = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userClient.findUniqueOrThrow({
      where: { id_usuario },
    })

    if (user && user.verificado) {
      //Paso el user a la request
      req.user = user
      next()
    } else {
      return res.status(400).json({ message: 'Necesitas iniciar sesion' })
    }
  } catch (error) {
    if (Error(error).message.split(':')[0] === 'TokenExpiredError')
      return res
        .status(401)
        .json({ message: 'Token expirado, vuelve a iniciar sesion' })
  }
}

module.exports = { authMiddleware }
