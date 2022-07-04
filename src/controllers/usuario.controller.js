//Importaciones
const express = require('express');
const Usuario = require('../models/usuario.model');
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

module.exports = {
    registrarSuperAdmin,
    login,
    registrarAdminHoteles,
    registrarUsuario,
    editarUsuario,
    eliminarUsuario,
    buscarUsuario,
    buscarUsuarioID

}