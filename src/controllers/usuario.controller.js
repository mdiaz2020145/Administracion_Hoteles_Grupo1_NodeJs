//Importaciones
const express = require('express');
const Usuario = require('../models/usuario.model');
const Habitacion = require('../models/habitacion.model');
const Servicio = require('../models/servicio.model');
const Evento = require('../models/evento.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


//Registrar SuperAdmin 
function registrarSuperAdmin(req, res) {
    var usuarioModelo = new Usuario();
    usuarioModelo.nombre = 'SUPER_ADMIN';
    usuarioModelo.email = 'SUPER_ADMIN';
    usuarioModelo.rol = 'ROL_SUPERADMIN';


    Usuario.find({ email: 'SUPER_ADMIN', nombres: 'SUPER_ADMIN' }, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            bcrypt.hash("123456", null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardado) => {
                    console.log(err)
                })
            })
        } else {
            console.log('El usuario super admin ya esta creado')
        }
    })
}

//Login 
function login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {//TRUE OR FALSE
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide' });
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.' })
        }
    })
}

//Registrar Admin de hoteles 
function registrarAdminHoteles(req, res) {
    var parametros = req.body;
    var usuarioModelo = new Usuario();

    if (parametros.nombre && parametros.email && parametros.password) {
        usuarioModelo.nombre = parametros.nombre;
        usuarioModelo.email = parametros.email;
        usuarioModelo.password = parametros.password;
        usuarioModelo.rol = 'ROL_ADMIN';
        Usuario.find({ email: parametros.email }, (err, clienteRegistrado) => {
            if (clienteRegistrado.length == 0) {
                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModelo.password = passwordEncriptada;
                    usuarioModelo.save((err, clienteGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                        if (!clienteGuardado) return res.status(404).send({ mensaje: 'No se agrego al usuario' });
                        return res.status(201).send({ usuarios: clienteGuardado });
                    })

                })
            } else {
                return res.status(500).send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
            }

        })

    }else{
        return res.status(500).send({ mensaje: 'Llene todos los campos para continuar' });
    }
}

//Registar Usuario 
function registrarUsuario(req, res) {
    var parametros = req.body;
    var usuarioModelo = new Usuario();

    if ( parametros.nombre, parametros.email, parametros.password) {
        usuarioModelo.nombre = parametros.nombre;
        usuarioModelo.email = parametros.email;
        usuarioModelo.password = parametros.password;
        usuarioModelo.rol = 'ROL_USUARIO';

        Usuario.find({ email: parametros.email }, (err, clienteRegistrado) => {
            if (clienteRegistrado.length == 0) {
                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModelo.password = passwordEncriptada;
                    usuarioModelo.save((err, clienteGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                        if (!clienteGuardado) return res.status(404).send({ mensaje: 'No se agrego al usuario' });
                        return res.status(201).send({ usuarios: clienteGuardado });
                    })

                })
            } else {
                return res.status(500).send({ mensaje: 'Este correo, ya  se encuentra utilizado' });
            }

        })
    }else{
        return res.status(500).send({ mensaje: 'Llene todos los campos' });
    }

}

//Editar usuario
function editarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    var parametros = req.body;
    Usuario.findByIdAndUpdate(idUsuario, parametros, { new: true }, (err, usuarioActualizado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioActualizado) return res.status(404).send({ mensaje: 'Error al editar el usuario' });
        return res.status(200).send({ usuario: usuarioActualizado })
    })

}

//Eliminar Usuario
function eliminarUsuario(req, res) {
    var id = req.params.idUsuario;
    Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioEliminado) return res.status(404).send({ mensaje: 'Error al eliminar el usuario' });
        return res.status(200).send({ usuario: usuarioEliminado })
    })

}


//Buscar Usuario general 
function buscarUsuario(req, res) {
    Usuario.find((err, usuarioEncontrado) => {
        if (err) return res.send({ mensaje: "Error: " + err })
        for (let i = 0; i < usuarioEncontrado.length; i++) {

        }
        return res.status(200).send({ usuario: usuarioEncontrado })
    })
}

//Buscar usuario por ID
function buscarUsuarioID(req, res) {
    var idUsuario = req.params.idUsuario;
    Usuario.findById(idUsuario, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!usuarioEncontrado) return res.status(404).send({ mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ usuario: usuarioEncontrado })
    })
}

//Reservaciones
function reservacionHabitaciones(req,res){
    var usuario = req.user.sub;
    var parametros = req.body;
    var idHabitacion = req.params.idHabitacion;

    Habitacion.findOne({_id:idHabitacion},(err,habitacionEncontrada)=>{
        if(err) return res.status(500).send({mensaje:'error en la peticion'});
        if(!habitacionEncontrada) return res.status(404).send({mensaje:'Error al encontrar la habitacion'})

        Usuario.find({_id:usuario},{reservacionHabitacion:{$elementMatch:{idHabitacion: idHabitacion}}},(err,res)=>{
            if(res == null){
                Usuario.findByIdAndUpdate(usuario,{
                    $push:{
                        reservacionHabitacion:{
                            idHabitacion:habitacionEncontrada._id,
                            precio:habitacionEncontrada.precio
                        }
                    }
                },{new:true},(err, usuarioReservacionHabitacion)=>{
                    if (err) return res.status(500).send({mensaje: "Error en la peticion"});
                    if(!habitacionEncontrada) return res.status(404).send({mensaje:'Error al tratar de agregar la habitacion'});
                    let totalReservacionHabitacion=0;
                    for(let i=0; i<usuarioReservacionHabitacion.reservacionHabitacion.length; i++){
                        totalReservacionHabitacion=totalReservacionHabitacion+usuarioReservacionHabitacion.reservacionHabitacion[i].precio
                    }

                    Usuario.findByIdAndUpdate(usuario, {totalReservacionHabitacion: totalReservacionHabitacion},{new:true},(err, reservacionModificada)=>{
                        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
                        if(!habitacionEncontrada) return res.status(404).send({mensaje:'Error al tratar de agregar la habitacion'});
                        //return res.status(200).send({mensaje:'Estupidos'})
                    })
                })
            }else{
                Usuario.findByIdAndUpdate({$inc:{precio:parametros.precio}},{new:true},(err,reservacionA)=>{
                    if (err) return res.status(500).send({mensaje: "Error en la peticion"});
                    if(!reservacionA) return res.status(404).send({mensaje:'Error al tratar de agregar la habitacion'});
                    return res.status(200).send({habitacion:reservacionA})
                })
            }
        })

        Usuario.find({_id:usuario},(err,usuarioEncontrado)=>{
            if (err) return res.status(500).send({mensaje: "Error en la peticion"});
            if(!usuarioEncontrado) return res.status(404).send({mensaje:'Error al encontrar al usuario'});
            return res.status(200).send({Usuario:usuarioEncontrado});
        })
    })
}

function reservacionEvento(req,res){
    var usuario = req.user.sub;
    var parametros = req.body;
    var idEvento = req.params.idEvento;

    Evento.findOne({_id:idEvento},(err,eventoEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'error en la peticion'});
        if(!eventoEncontrado) return res.status(404).send({mensaje:'Error al encontrar el evento'})

        Usuario.find({_id:usuario},{reservacionEvento:{$elementMatch:{idEvento: idEvento}}},(err,res)=>{
            if(res == null){
                Usuario.findByIdAndUpdate(usuario,{
                    $push:{
                        reservacionEvento:{
                            idEvento:eventoEncontrado._id,
                            precio:eventoEncontrado.precio
                        }
                    }
                },{new:true},(err, usuarioReservacionEvento)=>{
                    if (err) return res.status(500).send({mensaje: "Error en la peticion"});
                    if(!eventoEncontrado) return res.status(404).send({mensaje:'Error al tratar de agregar la habitacion'});
                    let totalReservacionEvento=0;
                    for(let i=0; i<usuarioReservacionEvento.reservacionEvento.length; i++){
                        totalReservacionEvento=totalReservacionEvento + usuarioReservacionEvento.reservacionEvento[i].precio
                    }

                    Usuario.findByIdAndUpdate(usuario, {totalReservacionEvento: totalReservacionEvento},{new:true},(err, reservacionModificada)=>{
                        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
                        if(!eventoEncontrado) return res.status(404).send({mensaje:'Error al tratar de agregar la habitacion'});
                    })
                })
            }else{
                Usuario.findByIdAndUpdate({$inc:{precio:parametros.precio}},{new:true},(err,reservacionB)=>{
                    if (err) return res.status(500).send({mensaje: "Error en la peticion"});
                    if(!reservacionB) return res.status(404).send({mensaje:'Error al tratar de agregar la habitacion'});
                    return res.status(200).send({Evento:reservacionB})
                })
            }
        })

        Usuario.find({_id:usuario},(err,usuarioEncontrado)=>{
            if (err) return res.status(500).send({mensaje: "Error en la peticion"});
            if(!usuarioEncontrado) return res.status(404).send({mensaje:'Error al encontrar al usuario'});
            return res.status(200).send({Usuario:usuarioEncontrado});
        })
    })
}

function reservacionServicio(req,res){
    var usuario = req.user.sub;
    var parametros = req.body;
    var idServicio = req.params.idServicio;

    Servicio.findOne({_id:idServicio},(err,servicioEncontrado)=>{
        if(err) return res.status(500).send({mensaje:'error en la peticion'});
        if(!servicioEncontrado) return res.status(404).send({mensaje:'Error al encontrar el servicio'})

        Usuario.find({_id:usuario},{reservacionServicio:{$elementMatch:{idEvento: idServicio}}},(err,res)=>{
            if(res == null){
                Usuario.findByIdAndUpdate(usuario,{
                    $push:{
                        reservacionServicio:{
                            idServicio:servicioEncontrado._id,
                            precio:servicioEncontrado.precio
                        }
                    }
                },{new:true},(err, usuarioReservacionServicio)=>{
                    if (err) return res.status(500).send({mensaje: "Error en la peticion"});
                    if(!servicioEncontrado) return res.status(404).send({mensaje:'Error al tratar de agregar la habitacion'});
                    let totalReservacionServicio=0;
                    for(let i=0; i<usuarioReservacionServicio.reservacionServicio.length; i++){
                        totalReservacionServicio=totalReservacionServicio + usuarioReservacionServicio.reservacionServicio[i].precio
                    }

                    Usuario.findByIdAndUpdate(usuario, {totalReservacionServicio: totalReservacionServicio},{new:true},(err, reservacionModificada)=>{
                        if (err) return res.status(500).send({mensaje: "Error en la peticion"});
                        if(!servicioEncontrado) return res.status(404).send({mensaje:'Error al tratar de agregar la habitacion'});
                    })
                })
            }else{
                Usuario.findByIdAndUpdate({$inc:{precio:parametros.precio}},{new:true},(err,reservacionC)=>{
                    if (err) return res.status(500).send({mensaje: "Error en la peticion"});
                    if(!reservacionC) return res.status(404).send({mensaje:'Error al tratar de agregar la habitacion'});
                    return res.status(200).send({Servicio:reservacionC})
                })
            }
        })

        Usuario.find({_id:usuario},(err,usuarioEncontrado)=>{
            if (err) return res.status(500).send({mensaje: "Error en la peticion"});
            if(!usuarioEncontrado) return res.status(404).send({mensaje:'Error al encontrar al usuario'});
            return res.status(200).send({Usuario:usuarioEncontrado});
        })
    })
}

module.exports = {
    registrarSuperAdmin,
    login,
    registrarAdminHoteles,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario,
    buscarUsuario,
    buscarUsuarioID,
    reservacionHabitaciones,
    reservacionEvento,
    reservacionServicio

}