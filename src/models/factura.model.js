const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var facturaSchema = Schema({
    reservacion:[{
        numeroDeHabitacion:String,
        idHabitacion:{type: Schema.Types.ObjectId, ref: 'Habitacion' }
    }],
    reservacionEvento:[{
        nombreEvento:String,
        idEvento:{type: Schema.Types.ObjectId, ref: 'Evento' }
    }],
    reservacionServicio:[{
        nombreServicio:String,
        idServicio:{type: Schema.Types.ObjectId, ref: 'Servicio' }
    }],
    totalHabitacion:Number,
    totalEvento:Number,
    totalServicio:Number,
    total:Number,
    idUsuario:{type: Schema.Types.ObjectId, ref: 'Usuarios' },
});


module.exports = mongoose.model('facturas',facturaSchema);