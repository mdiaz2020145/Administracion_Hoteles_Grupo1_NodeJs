const express = require('express');
const hotelController = require('../controllers/hotel.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarHotel', [md_autenticacion.Auth, md_autenticacion_roles.verSuperAdmin], hotelController.agregarHoteles)
api.put('/editarHotel/:idHotel', [md_autenticacion.Auth, md_autenticacion_roles.verSuperAdmin], hotelController.editarHoteles)
api.delete('/eliminarHotel/:idHotel', [md_autenticacion.Auth, md_autenticacion_roles.verSuperAdmin], hotelController.eliminarHoteles)
api.get('/buscarHotel', hotelController.buscarHoteles)
api.post('/buscarHotelPorPais', md_autenticacion.Auth, hotelController.buscarHotelesPais)

module.exports = api;