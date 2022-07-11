const express = require('express');
const facturaController = require('../controllers/factura.controller');


const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/generarFacutra',[md_autenticacion.Auth,md_autenticacion_roles.verUsuario],facturaController.generarFactura);
api.get('/obtenerFacturaUsuario/:idUsuario',[md_autenticacion.Auth,md_autenticacion_roles.verUsuario],facturaController.buscarFactura);

module.exports = api;