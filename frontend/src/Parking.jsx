import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/parkingrecords';
const CARS_API = 'http://localhost:3000/cars';
const SLOTS_API = 'http://localhost:3000/parkingslots';

export default function Parking() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [carID, setCarID] = useState('');
  const [slotID, setSlotID] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');

  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch {
      alert('Failed to fetch parking records');
    }
  };

  const fetchCars = async () => {
    try {
      const res = await axios.get(CARS_API);
      setCars(res.data);
    } catch {}
  };

  const fetchSlots = async () => {
    try {
      const res = await axios.get(SLOTS_API);
      setSlots(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchRecords();
    fetchCars();
    fetchSlots();
  }, []);

  // Load record data into form for editing
  const handleSelectRecord = (record) => {
    setSelectedRecordId(record.id);
    setCarID(record.CarID);
    setSlotID(record.SlotID);
    setEntryTime(record.EntryTime ? new Date(record.EntryTime).toISOString().slice(0, 16) : '');
    setExitTime(record.ExitTime ? new Date(record.ExitTime).toISOString().slice(0, 16) : '');
  };

  // Clear form
  const resetForm = () => {
    setSelectedRecordId(null);
    setCarID('');
    setSlotID('');
    setEntryTime('');
    setExitTime('');
  };

  // Create or update record
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carID || !slotID || !entryTime) {
      alert('Select Car, Slot, and Entry Time');
      return;
    }

    try {
      if (selectedRecordId) {
        // Update existing record
        await axios.put(`${API_URL}/${selectedRecordId}`, {
          CarID: carID,
          SlotID: slotID,
          EntryTime: entryTime,
          ExitTime: exitTime || null,
        });
        alert('Parking record updated');
      } else {
        // Create new record
        await axios.post(API_URL, {
          CarID: carID,
          SlotID: slotID,
          EntryTime: entryTime,
          ExitTime: exitTime || null,
        });
        alert('Parking record created');
      }
      resetForm();
      fetchRecords();
    } catch {
      alert('Failed to save parking record');
    }
  };

  // Delete record
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this parking record?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      if (selectedRecordId === id) resetForm();
      fetchRecords();
    } catch {
      alert('Failed to delete parking record');
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Parking Records</h2>

      <div className="card mb-4 shadow-sm">
        <div className={`card-header ${selectedRecordId ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
          {selectedRecordId ? 'Edit Parking Record' : 'Create Entry Record'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3 align-items-end">
            <div className="col-md-3">
              <label htmlFor="carSelect" className="form-label">Select Car</label>
              <select
                id="carSelect"
                className="form-select"
                value={carID}
                onChange={(e) => setCarID(e.target.value)}
              >
                <option value="">Choose a car</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.PlateNumber} - {car.OwnerName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label htmlFor="slotSelect" className="form-label">Select Slot</label>
              <select
                id="slotSelect"
                className="form-select"
                value={slotID}
                onChange={(e) => setSlotID(e.target.value)}
              >
                <option value="">Choose a slot</option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.SlotNumber} ({slot.IsAvailable ? 'Available' : 'Occupied'})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label htmlFor="entryTime" className="form-label">Entry Time</label>
              <input
                id="entryTime"
                type="datetime-local"
                className="form-control"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="exitTime" className="form-label">Exit Time</label>
              <input
                id="exitTime"
                type="datetime-local"
                className="form-control"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
              />
            </div>

            <div className="col-md-12 d-flex justify-content-end gap-2">
              {selectedRecordId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="btn btn-success">
                {selectedRecordId ? 'Update Record' : 'Create Record'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <h3>All Parking Records</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Car</th>
              <th>Slot</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No records found.</td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{cars.find(car => car.id === r.CarID)?.PlateNumber || r.CarID}</td>
                  <td>{slots.find(slot => slot.id === r.SlotID)?.SlotNumber || r.SlotID}</td>
                  <td>{new Date(r.EntryTime).toLocaleString()}</td>
                  <td>{r.ExitTime ? new Date(r.ExitTime).toLocaleString() : 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleSelectRecord(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
