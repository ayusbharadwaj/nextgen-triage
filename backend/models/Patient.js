

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String }, // <--- IF THIS IS MISSING, MONGOOSE DELETES THE ID!
  name: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String },
  disease: { type: String },
  contact: { type: String },
  status: { type: String, default: 'Stable' }
});

module.exports = mongoose.model('Patient', patientSchema);