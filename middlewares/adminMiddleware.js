const adminMiddleware = (req, res, next) => {
  if (req.user.rol === 'ADMIN') next()
  else {
    return res.status(401).json({ message: 'Usted no esta autorizado' })
  }
}
module.exports = { adminMiddleware }
