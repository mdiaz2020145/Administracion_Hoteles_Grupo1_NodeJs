const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    nombre:String,
    email:String,
    password: String,
    rol:String,
    reservacionHabitacion:[{
        //numeroDeHabitacion:String,
        idHabitacion:{type: Schema.Types.ObjectId, ref: 'Habitacion' },
        precio:Number
    }],
    reservacionEvento:[{
        idEvento:{type: Schema.Types.ObjectId, ref: 'Evento' },
        precio:Number
    }],
    reservacionServicio:[{
        idServicio:{type: Schema.Types.ObjectId, ref: 'Servicio' },
        precio:Number
    }],
    totalReservacionHabitacion: Number,
    totalReservacionEvento: Number,
    totalReservacionServicio: Number,
    totalReservaciones: Number

});

module.exports = mongoose.model('Usuarios', UsuarioSchema);