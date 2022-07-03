const express = require('express');
const habitacionController = require('../controllers/habitaciones.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarHabitacion/:idHotel', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], habitacionController.agregarHabitacion);
api.put('/editarHabitacion/:idHabitacion', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], habitacionController.editarHabitacion);
api.delete('/eliminarHabitacion/:idHabitacion', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], habitacionController.eliminarHabitacion);
api.get('/buscarHabitaciones/:idHotel', habitacionController.buscarHabitaciones);
api.get('/buscarHabitacionId/:idHabitacion', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], habitacionController.buscarHabitacionId);
api.post('/buscarHotelDisponible', habitacionController.habitacionesDisponibles);
module.exports = api;