const express = require('express');
const modeloServicio = require('../controllers/servicio.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/agregarServicio/:idHotel', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], modeloServicio.agregarServicio);
api.put ('/editarServicio/:idServicio', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], modeloServicio.editarServicio);
api.delete('/eliminarServicio/:idServicio', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], modeloServicio.eliminarServicio);
api.get('/buscarServicios', md_autenticacion.Auth, modeloServicio.buscarServicios);
api.get('/buscarServicioNombre/:nombreServicio', md_autenticacion.Auth, modeloServicio.obtenerServicioPorNombre);
api.get('/obtenerServicioId/:idServicio', md_autenticacion.Auth, modeloServicio.buscarServicioId)
api.get('/obtenerServicio/:idHotel',modeloServicio.obtenerServicio)

module.exports = api;