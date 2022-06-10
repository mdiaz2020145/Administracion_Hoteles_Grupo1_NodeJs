const Hotel = require('../models/hotel.model')
const Usuario = require('../models/usuario.model')
const underscore = require('underscore')


// Agregar
function agregarHoteles(req, res) {
    let parametros = req.body
    if (parametros.nombre && parametros.direccion && parametros.pais) {

        Hotel.find({ nombre: parametros.nombre }, (err, hotelesEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
            if (underscore.isEmpty(hotelesEncontrados)) {
                let hotelModel = new Hotel();
                hotelModel.nombre = parametros.nombre
                hotelModel.direccion = parametros.direccion
                hotelModel.pais = parametros.pais
                hotelModel.idAdmin = req.user.sub
                hotelModel.save((err, hotelGuardado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion al guardar' });
                    return res.status(200).send({ mensaje: hotelGuardado })
                })

            } else {
                return res.status(200).send({ mensaje: 'Ya existe un hotel con ese nombre' })
            }
        })

    } else {
        return res.status(500).send({ mensaje: 'No has llenado todos los campos' })
    }

}
// Editar
function editarHoteles(req, res) {
    let idH = req.params.idHotel;
    let parametros = req.body
    if (parametros.dueno || parametros.idAdmin) {
        return res.status(500).send({ mensaje: 'No se puede cambiar ese campo' })
    } else {
        Hotel.findById(idH, (err, hotelesEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
            if (underscore.isEmpty(hotelesEncontrados)) {
                return res.status(404).send({ mensaje: 'No existe un hotel con ese id' })
            } else {
                if (hotelesEncontrados.idAdmin === req.user.sub) {
                    Hotel.findByIdAndUpdate(idH, parametros, { new: true }, (err, hotelEditado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
                        return res.status(200).send({ mensaje: hotelEditado })
                    })
                } else {
                    return res.status(404).send({ mensaje: 'No posees un hotel con ese id' })
                }
            }
        })
    }
}
// Eliminar
function eliminarHoteles(req, res) {
    let idH = req.params.idHotel;
    Hotel.findById(idH, (err, hotelesEncontrados) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
        if (underscore.isEmpty(hotelesEncontrados)) {
            return res.status(404).send({ mensaje: 'No existe un hotel con ese id' })
        } else {
            if (hotelesEncontrados.idAdmin === req.user.sub) {
                Hotel.findByIdAndDelete(idH, (err, hotelEditado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
                    return res.status(200).send({ mensaje: hotelEditado })
                })
            } else {
                return res.status(404).send({ mensaje: 'No posees un hotel con ese id' })
            }
        }
    })
}

//buscar todos los hoteles
function buscarHoteles(req, res) {
    Hotel.find((err, hotelesEncontrados) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
        if (!hotelesEncontrados) return res.status(404).send({ mensaje: 'Tiene datos vacios' });
        return res.status(200).send({ mensaje: hotelesEncontrados })
    })
}

// buscar por pais
function buscarHotelesPais(req, res) {
    let parametros = req.body
    if (parametros.pais) {
        Hotel.find({ pais: parametros.pais }, (err, hotelesEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
            if (!hotelesEncontrados) return res.status(404).send({ mensaje: 'Tiene datos vacios' });
            return res.status(200).send({ mensaje: hotelesEncontrados })
        })
    } else {
        return res.status(404).send({ mensaje: 'No has llenado todos los campos' })
    }
}

module.exports = {
    agregarHoteles,
    editarHoteles,
    eliminarHoteles,
    buscarHoteles,
    buscarHotelesPais
}