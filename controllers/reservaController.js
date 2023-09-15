const {Reserva} = require('../entities/Reserva.js');
const {getAll, newReserva, getReservaByDni, getTurnoReservado} = require('../data/dataReserva.js');
const {Usuario} = require('../entities/Usuario.js');
const agregarReservaView = (req, res) => {
    res.render("agregarReserva", {});
}

const listarReservaView = (req, res) => {
    getAll().then((reservas) => {
        res.send(reservas)
    } ).catch((err) => {
        res.send("no reservado");
    })
}


const listarReservaPorUsuario = (req, res) => {
    const {id_usuario, dni, nombre, apellido, telefono, email} = req.cookies.user;
    const user = new Usuario(id_usuario, dni, nombre, apellido, telefono, email, null);
    getReservaByDni(user).then((reserva) => {
        res.send(reserva);
    }).catch((err) => {
        res.send("no reservado");
    })
}

const agregarReserva = (req, res) => {
    const {fecha_hora_turno, id_usuario, fecha_hora_reserva, nro_cancha} = req.body;
    const reserva = new Reserva(null, fecha_hora_turno, fecha_hora_reserva, "reservado", id_usuario, nro_cancha);
    //habria que separar la fecha/hora en dos campos distintos
    //faltan validaciones (si la cancha esta ocupada, si la fecha/hora es valida, etc)
    getTurnoReservado(reserva).then((isReservado) => {
        if (isReservado) {
            res.send("ya existe una reserva para esa fecha/hora");
        } else {
            newReserva(reserva).then((rows) => {
                res.send("reservado");
            })
        }
    })
}

module.exports={
    agregarReservaView,
    listarReservaView,
    agregarReserva,
    listarReservaPorUsuario
}