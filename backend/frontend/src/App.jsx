import { useState, useEffect } from "react";
import axios from "axios";

// --- 1. LOGIN COMPONENT ---
function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

const handleLogin = async (e) => {
    e.preventDefault(); 
    
    // 1. PROOF OF LIFE
    alert("Button clicked! Attempting to talk to the server...");

    try {
      const response = await axios.post("https://nextgen-backend-zfvh.onrender.com/api/login", { 
          username: credentials.username, // <--- CHANGED FROM 'email' TO 'username'
          password: credentials.password 
      });
      
      // 2. SUCCESS ALERT
      alert("Server replied: Success!");
      console.log("Login Success Data:", response.data);
      
      if (onLoginSuccess) {
          onLoginSuccess(); 
      }
      
    } catch (error) {
      // 3. FAILURE ALERT
      const serverMessage = error.response?.data?.message || error.message;
      alert("Server rejected us! Reason: " + serverMessage);
      setError("Backend says: " + serverMessage);
    }
  };
  return (
    <div style={loginPageStyle}>
      <form onSubmit={handleLogin} style={loginFormStyle}>
        <h2 style={{ textAlign: "center", color: "#1e293b", marginBottom: "20px" }}>⚡ NextGen Triage Login</h2>
        {error && <div style={errorAlertStyle}>{error}</div>}
        <input 
          type="text" placeholder="Username" required style={inputStyle}
          value={credentials.username} onChange={(e) => setCredentials({...credentials, username: e.target.value})} 
        />
        <input 
          type="password" placeholder="Password" required style={inputStyle}
          value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
        />
        <button type="submit" style={loginButtonStyle}>Authenticate</button>
      </form>
    </div>
  );
}

// --- 2. MAIN DASHBOARD ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", age: "", gender: "", disease: "", contact: "", status: "Stable" 
  });

  useEffect(() => {
    const auth = localStorage.getItem("hospital_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchPatients();
    }
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("https://nextgen-backend-zfvh.onrender.com/api/patients");
      setPatients(res.data);
    } catch (err) { console.error(err); }
  };

  const handleLoginSuccess = () => {
    localStorage.setItem("hospital_auth", "true");
    setIsAuthenticated(true);
    fetchPatients();
  };

  const handleLogout = () => {
    localStorage.removeItem("hospital_auth");
    setIsAuthenticated(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const res = await axios.put(`https://nextgen-backend-zfvh.onrender.com/api/patients/${isEditing}`, formData);
        setPatients(prev => prev.map(p => p._id === isEditing ? res.data : p));
        setIsEditing(null);
      } else {
        const res = await axios.post("https://nextgen-backend-zfvh.onrender.com/api/patients", formData);
        setPatients(prev => [res.data, ...prev]);
      }
      setFormData({ name: "", age: "", gender: "", disease: "", contact: "", status: "Stable" });
    } catch (err) { console.error(err); }
  };

  const deletePatient = async (id) => {
    if (window.confirm("Discharge this patient?")) {
      await axios.delete(`https://nextgen-backend-zfvh.onrender.com/api/patients/${id}`);
      
      setPatients(prev => prev.filter(p => p._id !== id));
    }
  };

  const startEdit = (p) => {
    setIsEditing(p._id);
    setFormData({ name: p.name, age: p.age, gender: p.gender, disease: p.disease, contact: p.contact, status: p.status });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) return <Login onLoginSuccess={handleLoginSuccess} />;

  // DERIVED DATA
  const sortedPatients = [...patients].sort((a, b) => b._id.localeCompare(a._id));
  const criticalPatients = sortedPatients.filter(p => p.status === "Critical");
  const urgentCount = patients.filter(p => p.status === "Urgent").length;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>⚡ NextGen Triage Management</h1>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </div>

      <div style={mainContentStyle}>
        {/* STATS SUMMARY */}
        <div style={statsContainerStyle}>
          <div style={statBadgeStyle("#38bdf8")}>Total: {patients.length}</div>
          <div style={statBadgeStyle("#ef4444")}>🚨 Critical: {criticalPatients.length}</div>
          <div style={statBadgeStyle("#f59e0b")}>⚠️ Urgent: {urgentCount}</div>
        </div>

        {/* ADMISSION FORM */}
        <div style={{ ...cardStyle, border: isEditing ? "3px solid #38bdf8" : "none" }}>
          <h3 style={{ marginTop: 0 }}>{isEditing ? "📝 Edit Patient Record" : "➕ Patient Admission"}</h3>
          <form onSubmit={handleSubmit} style={formGridStyle}>
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
            <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} required style={inputStyle} />
            <input name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} required style={inputStyle} />
            <input name="disease" placeholder="Disease" value={formData.disease} onChange={handleChange} required style={inputStyle} />
            <input name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required style={inputStyle} />
            
            {/* DROPDOWN FOR STATUS */}
            <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
              <option value="Stable">Stable ✅</option>
              <option value="Urgent">Urgent ⚠️</option>
              <option value="Critical">Critical 🚨</option>
            </select>

            <button type="submit" style={{ ...submitButtonStyle, background: isEditing ? "#38bdf8" : "#10b981" }}>
              {isEditing ? "Update Patient" : "Admit Patient"}
            </button>
            {isEditing && <button type="button" onClick={() => {setIsEditing(null); setFormData({name:"",age:"",gender:"",disease:"",contact:"",status:"Stable"})}} style={cancelButtonStyle}>Cancel</button>}
          </form>
          {/* Example of how it might look in your JSX */}
<div className="patient-card">
   <h4>ID: {patient.patientId}</h4>
   <p>Name: {patient.name}</p>
   <p>Disease: {patient.disease}</p>
</div>
        </div>

        {/* EMERGENCY WARD SECTION */}
        {criticalPatients.length > 0 && (
          <div style={emergencyWardStyle}>
            <h2 style={{ color: "#ef4444", marginTop: 0 }}>🚨 Emergency Ward (Critical Attention Required)</h2>
            <div style={{ display: "grid", gap: "15px" }}>
              {criticalPatients.map(p => (
                <PatientCard key={p._id} p={p} onEdit={startEdit} onDelete={deletePatient} />
              ))}
            </div>
          </div>
        )}

        {/* SEARCH & DIRECTORY */}
        <input 
          type="text" placeholder="🔍 Search by name or disease..." 
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={searchBarStyle}
        />
        
        <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Patient Directory</h2>
        <div style={{ display: "grid", gap: "15px" }}>
          {sortedPatients
            .filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.disease?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(p => <PatientCard key={p._id} p={p} onEdit={startEdit} onDelete={deletePatient} />)}
        </div>

        <footer style={footerStyle}>
          NextGen Triage Management System v1.0 | Developed by Ayush
        </footer>
      </div>
    </div>
  );
}

// --- 3. PATIENT CARD COMPONENT ---
function PatientCard({ p, onEdit, onDelete }) {
  const color = p.status === "Critical" ? "#ef4444" : p.status === "Urgent" ? "#f59e0b" : "#10b981";
  return (
    <div style={{ ...patientCardStyle, borderLeft: `15px solid ${color}` }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, color: "#1e293b" }}>{p.name}</h3>
        <p style={{ margin: "5px 0", color: "#64748b" }}>
          <b>Age:</b> {p.age} | <b>Status:</b> <span style={{color, fontWeight:"bold"}}>{p.status}</span>
        </p>
        <p style={{ margin: 0, color: "#475569" }}><b>Disease:</b> <span style={{fontWeight: "bold"}}>{p.disease}</span> | 📞 {p.contact}</p>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => onEdit(p)} style={editButtonStyle}>Edit</button>
        <button onClick={() => onDelete(p._id)} style={dischargeButtonStyle}>Discharge</button>
      </div>
    </div>
  );
}

// --- 4. STYLES ---
const containerStyle = { width: "100vw", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "Inter, sans-serif" };
const mainContentStyle = { maxWidth: "1200px", margin: "0 auto", padding: "40px" };
const headerStyle = { background: "linear-gradient(90deg, #1e293b 0%, #334155 100%)", color: "#38bdf8", padding: "15px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", borderBottom: "3px solid #38bdf8" };
const loginPageStyle = { height: "100vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" };
const loginFormStyle = { background: "white", padding: "40px", borderRadius: "20px", width: "380px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" };
const cardStyle = { background: "white", padding: "30px", borderRadius: "15px", marginBottom: "30px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" };
const inputStyle = { padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "15px", outline: "none", width: "100%", boxSizing: "border-box" };
const formGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" };
const submitButtonStyle = { color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", padding: "12px" };
const loginButtonStyle = { width: "100%", padding: "12px", background: "#38bdf8", color: "#0f172a", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", marginTop: "15px" };
const cancelButtonStyle = { background: "#94a3b8", color: "white", border: "none", borderRadius: "10px", padding: "12px", cursor: "pointer" };
const logoutButtonStyle = { background: "#ef4444", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const patientCardStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" };
const editButtonStyle = { background: "#38bdf8", color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const dischargeButtonStyle = { background: "#fee2e2", color: "#ef4444", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" };
const searchBarStyle = { width: "100%", padding: "18px", marginBottom: "30px", borderRadius: "15px", border: "2px solid #e2e8f0", fontSize: "16px", boxSizing: "border-box", outline: "none" };
const emergencyWardStyle = { marginBottom: "50px", padding: "30px", background: "#fff1f2", borderRadius: "20px", border: "2px dashed #ef4444" };
const statsContainerStyle = { display: "flex", gap: "20px", marginBottom: "30px", justifyContent: "center" };
const statBadgeStyle = (color) => ({ background: color, color: "white", padding: "12px 30px", borderRadius: "50px", fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" });
const errorAlertStyle = { color: "#ef4444", background: "#fee2e2", padding: "10px", borderRadius: "8px", marginBottom: "15px", textAlign: "center", fontWeight: "bold" };
const footerStyle = { textAlign: "center", marginTop: "60px", padding: "20px", color: "#94a3b8", fontSize: "14px", borderTop: "1px solid #e2e8f0" };

export default App;