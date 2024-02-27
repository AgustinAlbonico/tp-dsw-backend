const cron = require('node-cron')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const moment = require('moment')

const actualizarEstadoReservaCron = () => {
  cron.schedule(process.env.CRON_TIMER, async () => {
    try {
      const fechaHoy = moment()
      const fechaHoraRestada = fechaHoy.subtract(1, 'hour')
      fechaHoraRestada.minutes(0);

      const fechaFormateada = fechaHoraRestada.format('YYYY-MM-DD')
      const horaFormateada = fechaHoraRestada.format('HH:mm:ss');

      const result = await prisma.$executeRaw`UPDATE reserva SET estado = 'terminado' WHERE estado = 'reservado' and fecha_turno <= ${fechaFormateada} and hora_turno <= ${horaFormateada}`  
    
      console.log('Se actualizo el estado de ' + result + ' reservas');
    } catch (error) {
      console.log(error)
    }
  })
}

module.exports = { actualizarEstadoReservaCron }
