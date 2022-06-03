const mongoose = require('mongoose')
const app = require('./app')


mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/HotelesGrupo1', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Conexion a la base de datos exitosa :D')

    app.listen(3000, function () {
        //Llamar a la funcion para que se genere el admin al correr el programa
        console.log('Corriendo en el puerto 3000 :D') 
    })
}).catch(err => console.log(err))