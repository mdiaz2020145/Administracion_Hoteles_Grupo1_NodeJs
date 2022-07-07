const Servicio = require('../models/servicio.model');
const Hotel = require('../models/hotel.model');
const underscore = require('underscore');

function agregarServicio(req, res) {
    var parametros = req.body;
    var servicioModel = new Servicio;
    var idHotel = req.params.idHotel

    if (parametros.nombreServicio, parametros.precio) {
        Servicio.findOne({ nombreServicio: parametros.nombreServicio, idHotel: idHotel}, (err, servicioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (underscore.isEmpty(servicioEncontrado)) {

                Hotel.findOne({ idHotel: idHotel }, (err, hotelEncontrado) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" + err})
                    if (!underscore.isEmpty(hotelEncontrado)) {
                        servicioModel.nombreServicio = parametros.nombreServicio;
                        servicioModel.precio = parametros.precio;
                        if (parametros.descripcion) servicioModel.descripcion = parametros.descripcion;
                        servicioModel.idAdmin=req.user.sub;
                        servicioModel.idHotel=idHotel;
                        servicioModel.save((err, servicioGuardado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion al guardar' })
                            return res.status(200).send({ mensaje: servicioGuardado })
                        })
                    }
                })
            } else {
                return res.status(500).send({ mensaje: "Este servicio ya existe" })
            }
        })
    } else {
        return res.status(500).send({ mensaje: "Llene todos los campos" })
    }
}

function editarServicio(req, res){
    var parametros = req.body;
    var idServicio = req.params.idServicio;

    Servicio.findByIdAndUpdate(idServicio, parametros,{new : true}, (err, servicioEditado)=>{

        if (err) return res.status(500).send({mensaje: "Error en la peticion de editar servicio"});
        if (!servicioEditado) return res.status(500).send({mensaje: "No es posible editar un servicio inexistente"});

        if (servicioEditado) return res.status(200).send({"El servicio se ha editado": servicioEditado});
    })
}

function eliminarServicio(req,res){
    var idServicio = req.params.idServicio;

    Servicio.findByIdAndDelete(idServicio, (err, servicioEliminado)=>{
        if (err) return res.status(404).send({mensaje: "Error en la peticion de eliminar servicio"});
        if(!servicioEliminado) return res.status(404).send({mensaje: "No es posible eliminar un servicio inexistente"});

        if(servicioEliminado) return res.status(200).send({"El servicio se ha eliminado": servicioEliminado});
    })
}

function buscarServicios(req, res) {
    Servicio.find({idAdmin: req.user.sub},(err, serviciosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!serviciosEncontrados) return res.status(404).send({ mensaje: 'Error al obtener los servicios' });

        return res.status(200).send({Servicios: serviciosEncontrados });
    })
}

function obtenerServicioPorNombre(req, res){
    var nombreService = req.params.nombreServicio;

    Servicio.findOne( { nombre : { $regex: nombreService, $options: 'i' }}, (err, servicioEncontrado) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!servicioEncontrado) return res.status(404).send({ mensaje: "Error, ese servicio no existe" });

        return res.status(200).send({ Servicio: servicioEncontrado });
    })
}

function buscarServicioId(req, res) {
    var idService = req.params.idServicio;
    Servicio.findById(idService, (err, servicioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!servicioEncontrado) return res.status(404).send({ mensaje: 'Error al obtener el servicio por id' });

        return res.status(200).send({ Servicio: servicioEncontrado});
    })
}

//Id por hotel
function obtenerServicio(req,res){
    var idHotel=req.params.idHotel;

    Servicio.find({idHotel: idHotel},(err,servicioEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!servicioEncontrado) return res.status(404).send({ mensaje: 'Error al obtener los Servicios' });
        return res.status(200).send({ mensaje: "los servicios se han encontrado con exito", servicios: servicioEncontrado })
    })
}

module.exports={
    agregarServicio,
    editarServicio,
    eliminarServicio,
    buscarServicios,
    obtenerServicioPorNombre,
    buscarServicioId,
    obtenerServicio
}