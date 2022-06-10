const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HabitacionSchema = Schema({
    numeroDeHabitacion:String, 
    descripcion:String,
    precio:Number, 
    idAdmin:{type: Schema.Types.ObjectId, ref: 'Usuarios' },
    idHotel:{type: Schema.Types.ObjectId, ref: 'Hotel' }
})

module.exports = mongoose.model('Habitacion', HabitacionSchema);