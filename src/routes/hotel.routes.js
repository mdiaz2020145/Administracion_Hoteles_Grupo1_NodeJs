const express = require('express');
const hotelController = require('../controllers/hotel.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarHotel', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], hotelController.agregarHoteles)
api.put('/editarHotel/:idHotel', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], hotelController.editarHoteles)
api.delete('/eliminarHotel/:idHotel', [md_autenticacion.Auth, md_autenticacion_roles.verAdministrador], hotelController.eliminarHoteles)
api.get('/buscarHotel', hotelController.buscarHoteles)
api.post('/buscarHotelPorPais', md_autenticacion.Auth, hotelController.buscarHotelesPais)
api.get('/buscarHotelPorId/:idHotel', md_autenticacion.Auth, hotelController.buscarHotelPorId)

module.exports = api;