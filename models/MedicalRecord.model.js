
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MedicalRecordSchema = new Schema({
  pacienteId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medicoId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now, required: true },
  contenido: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = model('MedicalRecord', MedicalRecordSchema);

