const express = require('express');
const EventoController = require('../controllers/evento.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarEvento', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], EventoController.agregarEvento);
api.put('/editarEvento/:idEvento', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], EventoController.editarEvento);
api.delete('/eliminarEvento/:idEvento', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], EventoController.eliminarEvento);
api.get('/buscarEvento/:idHotel', EventoController.buscarEvento);
api.get('/buscarEventoPorID/:idEvento', [md_autenticacion.Auth, /*md_autenticacion_roles.verAdministrador*/], EventoController.buscarEventoID);
module.exports = api;