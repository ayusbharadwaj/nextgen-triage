import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PatientChart = ({ patients }) => {
  const criticalCount = patients.filter(p => p.status === 'Critical').length;
  const urgentCount = patients.filter(p => p.status === 'Urgent').length;
  const stableCount = patients.filter(p => p.status === 'Stable').length;

  const data = [
    { name: 'Critical', value: criticalCount },
    { name: 'Urgent', value: urgentCount },
    { name: 'Stable', value: stableCount },
  ];

  const COLORS = ['#ef4444', '#f59e0b', '#22c55e']; 

  if (patients.length === 0) return <p style={{textAlign: "center", color: "#64748b"}}>No patient data available for chart.</p>;

  return (
    // REMOVED: backgroundColor and borderRadius
    <div style={{ width: '100%', height: 300, padding: '20px' }}>
      
      
      <h3 style={{ color: '#1e293b', textAlign: 'center', marginBottom: '10px' }}>Patient Triage Overview</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '5px', color: '#fff' }} 
          />
          {/* CHANGED: Legend text color is now dark */}
          <Legend wrapperStyle={{ color: '#1e293b' }}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatientChart;