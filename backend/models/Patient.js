

// 2. Export the Blueprint so server.js can use it
module.exports = mongoose.model('Patient', patientSchema);
const patientSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  disease: String,
  contact: String,
  status: { type: String, default: "Stable" } // Add this line!
});