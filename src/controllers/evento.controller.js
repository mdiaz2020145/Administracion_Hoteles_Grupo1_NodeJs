const Hotel = require('../models/hotel.model')
const Usuario = require('../models/usuario.model')
const evento = require('../models/evento.model')
const underscore = require('underscore');



//Agregar evento 
function agregarEvento(req, res) {
    var parametros = req.body;
    var eventoModel = new evento;
    evento.findOne({ nombreEvento: parametros.idHotel }, (err, eventoAgregado) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
        if (underscore.isEmpty(eventoAgregado)) {
            Hotel.findById(parametros.idHotel, (err, hotelEncontrado) => {
                eventoModel.nombreEvento = parametros.nombreEvento;
                eventoModel.descripcion = parametros.descripcion;
                eventoModel.precio = parametros.precio;
                eventoModel.idAdmin = req.user.sub;
                eventoModel.idHotel = hotelEncontrado._id;
                eventoModel.save((err, eventoGuardado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion al guardar' })
                    return res.status(200).send({ mensaje: eventoGuardado })
                })
            })
        } else {
            return res.status(200).send({ mensaje: 'Ya existe un evento con ese nombre' })
        }
    })


}

//Editar evento 
function editarEvento(req, res) {
    var idEvento = req.params.idEvento;
    var parametros = req.body;
    evento.findByIdAndUpdate(idEvento, parametros, { new: true }, (err, eventoEditado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!eventoEditado) return res.status(404).send({ mensaje: 'Error al editar el usuario' });
        return res.status(200).send({ evento: eventoEditado })
    })

}

//Eliminar Evento 
function eliminarEvento(req, res) {
    var idEvento = req.params.idEvento;
    evento.findByIdAndDelete(idEvento, (err, eventoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!eventoEliminado) return res.status(404).send({ mensaje: 'Error al eliminar el evento' });
        return res.status(200).send({ evento: eventoEliminado });
    })

}

//Buscar Evento 
function buscarEvento(req, res) {
    let idH = req.params.idHotel
    evento.find({ idHotel: idH }, (err, eventosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!eventosEncontrados) return res.status(404).send({ mensaje: 'Error al obtener los eventos' });
        return res.status(200).send({ mensaje: "los eventos se han encontrado con exito", eventos: eventosEncontrados })
    })
}


//Buscar Evento por ID
function buscarEventoID(req, res) {
    var idEvento = req.params.idEvento;
    evento.findById(idEvento, (err, eventoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!eventoEncontrado) return res.status(404).send({ mensaje: 'Error al obtener los datos' });
        return res.status(200).send({ eventos: eventoEncontrado })
    })
}

module.exports = {
    agregarEvento,
    editarEvento,
    eliminarEvento,
    buscarEvento,
    buscarEventoID

}