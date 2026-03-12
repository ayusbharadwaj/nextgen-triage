

// 2. Export the Blueprint so server.js can use it

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true }, // Add this exact line
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String },
  disease: { type: String },
  contact: { type: String },
  status: { type: String, default: 'Stable' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);