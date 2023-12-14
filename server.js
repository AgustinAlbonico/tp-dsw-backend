const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')

require('dotenv').config()

const port = process.env.PORT || 5000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//Middleware para el uso de cookies
app.use(cookieParser())

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(morgan('dev'))

//RUTAS
app.use('/api', routes)

app.listen(port, () => {
  console.log('Server corriendo en el puerto: ' + port)
})
