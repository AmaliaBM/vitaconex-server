
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const AppointmentSchema = new Schema({
  pacienteId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medicoId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  datetime: { type: Date, required: true },
  estado: {
    type: String,
    enum: [ 'confirmado', 'cancelado'],
    default: 'confirmado',
    required: true,
  },
}, { timestamps: true });

module.exports = model('Appointment', AppointmentSchema);
