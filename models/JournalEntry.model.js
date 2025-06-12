const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const JournalEntrySchema = new Schema({
  pacienteId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  estadoAnimo: { type: Number, required: true, min: 1, max: 5 },
  diario: { type: String, default: '', trim: true },
  fecha: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = model('JournalEntry', JournalEntrySchema);
