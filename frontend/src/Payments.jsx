import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/payments';
const RECORDS_API = 'http://localhost:3000/parkingrecords';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [records, setRecords] = useState([]);

  const [parkingRecordID, setParkingRecordID] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(API_URL);
      setPayments(res.data);
    } catch {
      alert('Failed to fetch payments');
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await axios.get(RECORDS_API);
      setRecords(res.data);
    } catch {
      // handle error if needed
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!parkingRecordID || amount === '' || !paymentDate) {
      alert('All fields are required');
      return;
    }
    if (parseFloat(amount) <= 0) {
      alert('Amount must be greater than zero');
      return;
    }

    setLoading(true);
    try {
      await axios.post(API_URL, {
        ParkingRecordID: parkingRecordID,
        Amount: parseFloat(amount),
        PaymentDate: paymentDate,
      });
      alert('Payment recorded');
      setParkingRecordID('');
      setAmount('');
      setPaymentDate('');
      fetchPayments();
    } catch {
      alert('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    borderRadius: '12px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#fff',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  };

  const selectStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  };

  const buttonStyle = {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: loading ? '#6c757d' : '#007bff',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.1rem',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const paymentListStyle = {
    listStyle: 'none',
    paddingLeft: 0,
    maxHeight: '300px',
    overflowY: 'auto',
    borderTop: '1px solid #eee',
  };

  const paymentItemStyle = {
    padding: '12px 10px',
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.3s',
  };

  const paymentItemHoverStyle = {
    backgroundColor: '#f0f8ff',
  };

  const [btnHover, setBtnHover] = useState(false);
  const [hoveredPaymentId, setHoveredPaymentId] = useState(null);

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#007bff' }}>Payments</h2>

      <form style={formStyle} onSubmit={handleSubmit} autoComplete="off">
        <select
          value={parkingRecordID}
          onChange={(e) => setParkingRecordID(e.target.value)}
          disabled={loading}
          style={selectStyle}
          onFocus={(e) => (e.target.style.borderColor = '#007bff')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        >
          <option value="">Select Parking Record</option>
          {records.map((r) => (
            <option key={r.id} value={r.id}>
              Record #{r.id} - CarID: {r.CarID}, SlotID: {r.SlotID}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#007bff')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />

        <input
          type="date"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          disabled={loading}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#007bff')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />

        <button
          type="submit"
          disabled={loading || !parkingRecordID || amount === '' || !paymentDate}
          style={{ ...buttonStyle, ...(btnHover && !loading ? buttonHoverStyle : {}) }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
        >
          {loading ? 'Saving...' : 'Record Payment'}
        </button>
      </form>

      <h3 style={{ color: '#007bff', marginBottom: '12px' }}>All Payments</h3>
      <ul style={paymentListStyle}>
        {payments.map((p) => (
          <li
            key={p.id}
            style={{
              ...paymentItemStyle,
              ...(hoveredPaymentId === p.id ? paymentItemHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredPaymentId(p.id)}
            onMouseLeave={() => setHoveredPaymentId(null)}
          >
            <strong>ID:</strong> {p.id} &nbsp;|&nbsp; 
            <strong>RecordID:</strong> {p.ParkingRecordID} &nbsp;|&nbsp; 
            <strong>Amount:</strong> RWF {p.Amount.toFixed(2)} &nbsp;|&nbsp; 
            <strong>Date:</strong> {new Date(p.PaymentDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
