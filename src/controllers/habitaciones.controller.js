const Habitacion = require('../models/habitacion.model')
const Hoteles = require('../models/hotel.model')
const underscore = require('underscore')
const Hotel = require('../models/hotel.model')

//agregar habitaciones
function agregarHabitacion(req, res) {
    var idHotel = req.params.idHotel
    var parametros = req.body
    var habitacionModel = new Habitacion()

    if (parametros.numeroDeHabitacion, parametros.precio) {
        Habitacion.findOne({ numeroDeHabitacion: parametros.numeroDeHabitacion, idHotel:idHotel }, (err, habitcacionEncontrada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (underscore.isEmpty(habitcacionEncontrada)) {
                Hotel.findOne({idHotel: idHotel }, (err, hotelEncontrado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" + err })
                    if (!underscore.isEmpty(hotelEncontrado)) {
                        habitacionModel.numeroDeHabitacion = parametros.numeroDeHabitacion
                        habitacionModel.precio = parametros.precio
                        habitacionModel.disponible = true
                        habitacionModel.idAdmin = req.user.sub
                        habitacionModel.idHotel = idHotel
                        if (parametros.descripcion) habitacionModel.descripcion = parametros.descripcion
                        habitacionModel.save((err, habitacionCreada) => {
                            return res.status(200).send({ mensaje: "la habitacion se ha creado con exito", habitacion: habitacionCreada })
                        })
                    } else {
                        return res.status(500).send({ mensaje: "El hotel al que desea agregar la habitacion no existe" })
                    }
                })
            } else {
                return res.status(500).send({ mensaje: "Esta habitacion ya existe" })
            }
        })
    } else {
        return res.status(500).send({ mensaje: "Llene todos los campos" })
    }
}

//editar habitaciones
function editarHabitacion(req, res) {
    var parametros = req.body
    var idHabitacion = req.params.idHabitacion
    Habitacion.findByIdAndUpdate(idHabitacion, parametros, { new: true }, (err, habitacionEditada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!habitacionEditada) return res.status(404).send({ mensaje: 'Error al editar el la habitacion' });
        return res.status(200).send({ mensaje: "la habitacion se ha editado con exito", habitacion: habitacionEditada })
    })
}

//eliminar habitaciones 
function eliminarHabitacion(req, res) {
    var idHabitacion = req.params.idHabitacion;
    Habitacion.findByIdAndDelete(idHabitacion, (err, habitacionEliminada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!habitacionEliminada) return res.status(404).send({ mensaje: 'Error al eliminar la habitacion' });
        return res.status(200).send({ mensaje: "la habitacion se ha eliminado con exito", habitacion: habitacionEliminada });
    })
}

//listar todas las habitaciones por hotel
function buscarHabitaciones(req, res) {
    var idHotel=req.params.idHotel;
    Habitacion.find({idHotel: idHotel}, (err, habitacionesEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!habitacionesEncontradas) return res.status(404).send({ mensaje: 'Error al obtener las habitaciones' });
        return res.status(200).send({ mensaje: "las habitaciones se han encontrado con exito", habitaciones: habitacionesEncontradas })
    })
}

//buscar una habitacion por su id
function buscarHabitacionId(req, res) {
    var idHabitacion = req.params.idHabitacion;
    Habitacion.findById(idHabitacion, (err, habitacionEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!habitacionEncontrada) return res.status(404).send({ mensaje: 'Error al obtener la habitacion' });
        return res.status(200).send({ mensaje: "la habitacion se ha encontrado con exito", habitacion: habitacionEncontrada })
    })
}
// habitaciones disponibles
function habitacionesDisponibles(req, res) {
    let contador = 0;
    let parametros = req.body;
    if (parametros.nombre) {
        Hoteles.findOne({ nombre: parametros.nombre }, (err, hotelEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (underscore.isEmpty(hotelEncontrado)) return res.status(404).send({ mensaje: 'Error al obtener el hotel' });

            Habitacion.find({ idHotel: hotelEncontrado._id, disponible: true }, (err, habitacioDisponible) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!habitacioDisponible) return res.status(404).send({ mensaje: 'Error al obtener el hotel' });
                habitacioDisponible.forEach(habitaciones => { habitaciones.nombre, contador++; })
                return res.status(200).send({ habitacion: contador })
            })
        })
    } else {
        return res.status(404).send({ mensaje: 'No ha ingresado todos los datos' })
    }
}

module.exports = {
    agregarHabitacion,
    editarHabitacion,
    eliminarHabitacion,
    buscarHabitaciones,
    buscarHabitacionId,
    habitacionesDisponibles
}