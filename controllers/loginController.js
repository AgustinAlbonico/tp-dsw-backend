const { Usuario } = require('../../tp-dsw backend/backend/entities/Usuario.js')
const {
  getAll,
  newUser,
  getUserByPass,
  getRegistrado,
} = require('../../tp-dsw backend/backend/data/dataUsuario.js')

const loginView = (req, res) => {
  if (req.cookies.user !== undefined) {
    //si la cookie existe es porque ya inicio sesion, lo redirijo a la home
    res.redirect('/')
  } else {
    res.render('login', {})
  }
}

const registerView = (req, res) => {
  res.render('register', {})
}

const registerUser = (req, res) => {
  const { dni, nombre, apellido, email, password, telefono } = req.body
  const user = new Usuario(
    null,
    dni,
    nombre,
    apellido,
    email,
    password,
    telefono,
    null
  )
  getRegistrado(user).then((registrado) => {
    if (registrado) {
      res.send('email o dni ya registrado')
    } else {
      newUser(user)
        .then((user) => {
          res.cookie('user', user)
          res.send('registrado')
        })
        .catch((err) => {
          res.send('no registrado')
        })
    }
  })
}

const loginUser = (req, res) => {
  const { email, password } = req.body
  const user = new Usuario(null, null, null, null, email, password, null, null)
  getUserByPass(user)
    .then((userlogueado) => {
      //guardo en una cookie el usuario para saber q esta logueado
      res.cookie('user', userlogueado)
      res.send('logueado')
    })
    .catch((err) => {
      console.log('error: ', err)
      res.send('no logueado')
    })
}

const logout = (req, res) => {
  //elimino la cookie del usuario
  res.clearCookie('user')
  res.redirect('/')
}

module.exports = {
  loginView,
  registerView,
  registerUser,
  loginUser,
  logout,
}
