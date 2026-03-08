const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

// 1. FORCE Google DNS to bypass ISP blocks (Jio/Airtel fix)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
app.use(cors());
app.use(express.json());

// 2. MongoDB Atlas Connection (Password encoded: Alexa%40231)
const atlasURI = "mongodb+srv://admin:Alexa%40231@cluster0.888f8vh.mongodb.net/hospitalDB?appName=Cluster0";

mongoose.connect(atlasURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err.message));

// 3. Patient Schema
const patientSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  disease: String,
  contact: String,
  status: { type: String, default: "Stable" } 
});

const Patient = mongoose.model('Patient', patientSchema);

// --- ROUTES ---

// A. AUTHENTICATION (Login)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: ${username}`);

  // Using the real @ here for the check
  if (username === "admin" && password === "Alexa@231") {
    console.log("✅ Login Success");
    res.json({ success: true });
  } else {
    console.log("❌ Login Failed");
    res.status(401).json({ success: false, message: "Invalid Credentials" });
  }
});

// B. GET ALL PATIENTS (Newest First)
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find({}).sort({ _id: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// C. ADMIT NEW PATIENT
app.post('/api/patients', async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const saved = await newPatient.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// D. UPDATE PATIENT (Edit)
app.put('/api/patients/:id', async (req, res) => {
  try {
    const { _id, ...updateData } = req.body;
    const updated = await Patient.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// E. DISCHARGE PATIENT (Delete)
app.delete('/api/patients/:id', async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Discharged" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));