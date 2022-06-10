const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller'); 

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/login',usuarioControlador.login);
api.post('/registrarAdminHoteles',usuarioControlador.registrarAdminHoteles);
api.post('/registrarUsuario',usuarioControlador.registrarUsuario);
api.put('/editarUsuario/:idUsuario',usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario/:idUsuario',usuarioControlador.eliminarUsuario);
api.get('/buscarUsuario',usuarioControlador.buscarUsuario);
api.get('/buscarUsuarioID/:idUsuario',usuarioControlador.buscarUsuarioID)

module.exports = api;