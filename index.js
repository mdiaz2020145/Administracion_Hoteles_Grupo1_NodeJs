const mongoose = require('mongoose')
const app = require('./app')
require('dotenv').config()

UsuarioController = require('./src/controllers/usuario.controller');

mongoose.Promise=global.Promise;
mongoose.connect(process.env.HOTELES_DB_CONNECTION,{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Conexion a la base de datos exitosa :D')

    app.listen(process.env.PORT || 3000, function () {
        console.log('Corriendo en el puerto 3000 :D')
    })

    //Registrar super Admin 
    UsuarioController.registrarSuperAdmin();


}).catch(err => console.log(err))