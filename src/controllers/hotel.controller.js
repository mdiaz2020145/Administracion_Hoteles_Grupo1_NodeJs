const Hotel = require('../models/hotel.model')
const Usuario = require('../models/usuario.model')
const underscore = require('underscore')


// Agregar
function agregarHoteles(req, res) {
    let parametros = req.body
    if (parametros.nombre && parametros.direccion && parametros.pais && parametros.dueno) {
        Usuario.findOne({ nombre: parametros.dueno }, (err, usuarioEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
            if (underscore.isEmpty(usuarioEncontrado)) return res.status(404).send({ mensaje: 'Datos vacios' })
            if (usuarioEncontrado.rol !== 'ROL_ADMIN') {
                return res.status(404).send({ mensaje: 'Este usuario no es dueno' })
            } else {
                Hotel.find({ nombre: parametros.nombre }, (err, hotelesEncontrados) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
                    if (underscore.isEmpty(hotelesEncontrados)) {
                        let hotelModel = new Hotel();
                        hotelModel.nombre = parametros.nombre
                        hotelModel.direccion = parametros.direccion
                        hotelModel.pais = parametros.pais
                        hotelModel.idAdmin = usuarioEncontrado._id
                        hotelModel.save((err, hotelGuardado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion al guardar' });
                            return res.status(200).send({ mensaje: hotelGuardado })
                        })

                    } else {
                        return res.status(200).send({ mensaje: 'Ya existe un hotel con ese nombre' })
                    }
                })
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
    if (parametros.dueno) {
        return res.status(500).send({ mensaje: 'No se puede cambiar ese campo' })
    } else {
        Hotel.findById(idH, (err, hotelesEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
            if (underscore.isEmpty(hotelesEncontrados)) {
                return res.status(404).send({ mensaje: 'No existe un hotel con ese id' })
            } else {
                Hotel.findByIdAndUpdate(idH, parametros, { new: true }, (err, hotelEditado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
                    return res.status(200).send({ mensaje: hotelEditado })
                })
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
            Hotel.findByIdAndDelete(idH, (err, hotelEditado) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion al encontrar' });
                return res.status(200).send({ mensaje: hotelEditado })
            })
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