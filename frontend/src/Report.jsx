import React, { useEffect, useState } from 'react';

function ParkingReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/report') // Make sure your backend runs on this URL
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading report...</p>;
  if (error) return <p style={{ color: 'red' }}>Error loading report: {error}</p>;

  // Format to Rwandan Francs
  const formatRWF = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: 20, borderRadius: 6 }}>
      <h2>Parking System Report</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li><strong>Total Cars Parked:</strong> {report.totalCars}</li>
        <li><strong>Total Parking Slots:</strong> {report.totalSlots}</li>
        <li><strong>Active Parking Sessions:</strong> {report.activeParking}</li>
        <li><strong>Total Payments Collected:</strong> {formatRWF(report.totalPayments)}</li>
      </ul>
    </div>
  );
}

export default ParkingReport;
