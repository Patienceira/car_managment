import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/parkingslots';

export default function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [slotNumber, setSlotNumber] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    try {
      const res = await axios.get(API_URL);
      setSlots(res.data);
    } catch {
      alert('Failed to fetch parking slots');
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slotNumber) {
      alert('Slot Number is required');
      return;
    }
    if (editId && !window.confirm('Are you sure you want to update this slot?')) return;

    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, {
          SlotNumber: slotNumber,
          IsAvailable: isAvailable,
        });
        alert('Slot updated');
      } else {
        await axios.post(API_URL, {
          SlotNumber: slotNumber,
          IsAvailable: isAvailable,
        });
        alert('Slot created');
      }
      setSlotNumber('');
      setIsAvailable(true);
      setEditId(null);
      fetchSlots();
    } catch {
      alert('Error saving parking slot');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchSlots();
    } catch {
      alert('Delete failed');
    }
  };

  const handleEdit = (slot) => {
    setSlotNumber(slot.SlotNumber);
    setIsAvailable(Boolean(slot.IsAvailable));
    setEditId(slot.id);
  };

  const cancelEdit = () => {
    setSlotNumber('');
    setIsAvailable(true);
    setEditId(null);
  };

  // Styles
  const containerStyle = {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '6px',
    border: '1.5px solid #ccc',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  };

  const checkboxContainer = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1rem',
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

  const buttonCancelStyle = {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#dc3545',
    color: 'white',
    fontWeight: '600',
    fontSize: '1.1rem',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '8px',
  };

  const listStyle = {
    listStyle: 'none',
    paddingLeft: 0,
    maxHeight: '300px',
    overflowY: 'auto',
    borderTop: '1px solid #eee',
  };

  const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    borderBottom: '1px solid #eee',
  };

  const statusStyle = (available) => ({
    fontWeight: '600',
    color: available ? 'green' : 'red',
  });

  const buttonSmallStyle = {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    marginLeft: '8px',
  };

  const editBtnStyle = {
    ...buttonSmallStyle,
    backgroundColor: '#007bff',
    color: 'white',
  };

  const deleteBtnStyle = {
    ...buttonSmallStyle,
    backgroundColor: '#dc3545',
    color: 'white',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#007bff', textAlign: 'center' }}>Parking Slots</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Slot Number"
          value={slotNumber}
          onChange={(e) => setSlotNumber(e.target.value)}
          style={inputStyle}
          disabled={loading}
          onFocus={(e) => (e.target.style.borderColor = '#007bff')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
        <label style={checkboxContainer}>
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={() => setIsAvailable(!isAvailable)}
            disabled={loading}
          />
          Available
        </label>
        <button
          type="submit"
          disabled={loading || !slotNumber}
          style={buttonStyle}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
        >
          {loading ? 'Saving...' : editId ? 'Update Slot' : 'Add Slot'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={cancelEdit}
            disabled={loading}
            style={buttonCancelStyle}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#c82333')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#dc3545')}
          >
            Cancel
          </button>
        )}
      </form>

      <ul style={listStyle}>
        {slots.map((slot) => (
          <li key={slot.id} style={listItemStyle}>
            <div>
              <strong>{slot.SlotNumber}</strong> -{' '}
              <span style={statusStyle(slot.IsAvailable)}>
                {slot.IsAvailable ? 'Available' : 'Occupied'}
              </span>
            </div>
            <div>
              <button
                onClick={() => handleEdit(slot)}
                disabled={loading}
                style={editBtnStyle}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(slot.id)}
                disabled={loading}
                style={deleteBtnStyle}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
