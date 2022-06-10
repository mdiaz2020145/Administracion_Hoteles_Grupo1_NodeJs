const express = require('express')
const cors = require('cors')
var app = express()

//Importaciones Rutas
const UsuarioRutas = require('./src/routes/usuario.routes');
const HotelRutas = require('./src/routes/hotel.routes');
const EventoRutas = require('./src/routes/evento.routes');

//Middlewares -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras
app.use(cors());

//CARGA DE RUTAS
app.use('/api', UsuarioRutas, HotelRutas,EventoRutas);

module.exports = app;