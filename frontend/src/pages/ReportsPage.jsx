import React, { useState } from 'react';

// Mock data (you can change this later when backend is ready)
const mockTrips = [
  { id: 1, vehicle: 'MH-01-VAN', driver: 'Alex Johnson', distance: 150, fuel: 12, cost: 1800 },
  { id: 2, vehicle: 'MH-02-TRK', driver: 'Maria Gomez', distance: 300, fuel: 35, cost: 4500 },
  { id: 3, vehicle: 'MH-03-BUS', driver: 'Raj Patel', distance: 220, fuel: 28, cost: 3400 },
];

export default function ReportsPage() {
  const [trips, setTrips] = useState(mockTrips);

  // CSV Export Function (Pure JavaScript - works in any browser)
  const exportToCSV = () => {
    // 1. Define headers
    const headers = ['Trip ID', 'Vehicle', 'Driver', 'Distance (km)', 'Fuel (L)', 'Cost (₹)'];
    
    // 2. Convert data to rows
    const rows = trips.map(t => [t.id, t.vehicle, t.driver, t.distance, t.fuel, t.cost]);
    
    // 3. Create CSV string
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // 4. Create a download link and trigger it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'transitops_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6" style={{ fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        📊 Reports & Analytics
      </h1>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <input 
            type="text" 
            placeholder="🔍 Search trip..." 
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <button 
          onClick={exportToCSV}
          style={{
            backgroundColor: '#0D6EFD',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📥 Export CSV
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Trip ID</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Vehicle</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Driver</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Distance (km)</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Fuel (L)</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Cost (₹)</th>
          </tr>
        </thead>
        <tbody>
          {trips.map(t => (
            <tr key={t.id}>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{t.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{t.vehicle}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{t.driver}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{t.distance}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{t.fuel}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>₹{t.cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}