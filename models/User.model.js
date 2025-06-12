// ❗This is an example of a User Model. 
// TODO: Please make sure you edit the User model to whatever makes sense in your project.
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  role: {
    type: String,
    enum: ['admin', 'paciente', 'sanitario'],
    required: true,
  },
  name: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  datebirth: { type: Date, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  assignedSanitarios: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

module.exports = model('User', UserSchema);

