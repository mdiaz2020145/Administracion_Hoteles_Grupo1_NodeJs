const mongoose = require('mongoose')
const app = require('./app')
UsuarioController = require('./src/controllers/usuario.controller');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/HotelesGrupo1', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Conexion a la base de datos exitosa :D')

    app.listen(3000, function () {
        console.log('Corriendo en el puerto 3000 :D') 
    })

    //Registrar super Admin 
    UsuarioController.registrarSuperAdmin();


}).catch(err => console.log(err))