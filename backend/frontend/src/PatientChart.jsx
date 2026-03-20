import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PatientChart = ({ patients }) => {
  // 1. Calculate the data automatically from your patients array
  const criticalCount = patients.filter(p => p.status === 'Critical').length;
  const urgentCount = patients.filter(p => p.status === 'Urgent').length;
  const stableCount = patients.filter(p => p.status === 'Stable').length;

  // 2. Format the data for the chart
  const data = [
    { name: 'Critical', value: criticalCount },
    { name: 'Urgent', value: urgentCount },
    { name: 'Stable', value: stableCount },
  ];

  // 3. Define the custom hospital colors
  const COLORS = ['#ef4444', '#f59e0b', '#22c55e']; // Red, Orange, Green

  // Don't show the chart if there are no patients yet
  if (patients.length === 0) return <p>No patient data available for chart.</p>;

  return (
    <div style={{ width: '100%', height: 300, backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px' }}>
      <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '10px' }}>Patient Triage Overview</h3>
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
          <Legend wrapperStyle={{ color: 'white' }}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatientChart;