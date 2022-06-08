const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller'); 

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/login',usuarioControlador.login);
api.post('/registrarAdminHoteles',usuarioControlador.registrarAdminHoteles);
api.post('/registrarUsuario',usuarioControlador.registrarUsuario);


module.exports = api;