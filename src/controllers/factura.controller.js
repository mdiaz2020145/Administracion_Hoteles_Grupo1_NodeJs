const Usuario = require('../models/usuario.model');
const factura = require('../models/factura.model');



//Generar factura 

function generarFactura(req,res){

    var usuario = req.user.sub 
    var facturaModel = new factura(); 

    Usuario.findById(usuario,(err,facturaUsuarioEncontrado)=>{
        facturaModel.reservacion = facturaUsuarioEncontrado.reservacionHabitacion;
        facturaModel.reservacionEvento = facturaUsuarioEncontrado.reservacionEvento;
        facturaModel.reservacionServicio = facturaUsuarioEncontrado.reservacionServicio;
        facturaModel.totalHabitacion = facturaUsuarioEncontrado.totalReservacionHabitacion;
        facturaModel.totalEvento = facturaUsuarioEncontrado.totalReservacionEvento;
        facturaModel.totalServicio = facturaUsuarioEncontrado.totalReservacionServicio;

        facturaModel.total = facturaUsuarioEncontrado.totalReservacionHabitacion + facturaUsuarioEncontrado.totalReservacionEvento + facturaUsuarioEncontrado.totalReservacionServicio;

        facturaModel.idUsuario = req.user.sub;

        facturaModel.save((err,facturaGuardada)=>{
            Usuario.findByIdAndUpdate(usuario,{$set:{reservacionHabitacion:[],reservacionEvento:[],reservacionServicio:[]},totalReservacionHabitacion:0,totalReservacionEvento:0,totalReservacionServicio:0},{new:true},(err,facturaVacia)=>{
                return res.status(200).send({factura:facturaGuardada})
            })
        })
    })

}


//Buscar factura del usuario
function buscarFactura(req,res){
    var idUsuario = req.params.idUsuario;

    factura.find({idUsuario:idUsuario},(err,facturaEncontrada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!facturaEncontrada) return res.status(404).send({ mensaje: 'Error al obtener las habitaciones' });
        return res.status(200).send({ mensaje: "la factura  se ha encontrado con exito", factura: facturaEncontrada })
    })

}

module.exports={
    generarFactura,
    buscarFactura
}