const express = require('express')
const router = express.Router()

const { authMiddleware } = require('../middlewares/authMiddleware')

const {
  loginUser,
  registerUser,
  validateEmail,
  logoutUser,
  forgotPassword,
  getUsers,
} = require('../controllers/authController')

//Rutas
router.post('/login', loginUser)
router.post('/register', registerUser)
router.put('/validate-email/:token', validateEmail)
router.get('/logout', authMiddleware, logoutUser)
router.post('/forgot-password', forgotPassword)
router.get('/', getUsers)

module.exports = router
