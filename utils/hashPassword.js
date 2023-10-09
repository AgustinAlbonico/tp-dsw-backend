const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10)
  return await bcrypt.hash(password, salt)
}

const comparePasswords = async (inputPassword, userPassword) => {
  return await bcrypt.compare(inputPassword, userPassword)
}

module.exports = {
  hashPassword,
  comparePasswords,
}
