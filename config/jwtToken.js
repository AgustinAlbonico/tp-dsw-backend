const jwt = require('jsonwebtoken')

const generateToken = (id_usuario, email) => {
  return jwt.sign({ id_usuario, email }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  })
}

module.exports = {
  generateToken,
}
