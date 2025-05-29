import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/cars';

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [plateNumber, setPlateNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [editId, setEditId] = useState(null); // For tracking editing car id
  const [loading, setLoading] = useState(false);

  // Fetch all cars
  const fetchCars = async () => {
    try {
      const res = await axios.get(API_URL);
      setCars(res.data);
    } catch {
      alert('Failed to fetch cars');
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Create or update car
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plateNumber || !ownerName) {
      alert('Plate number and owner name are required');
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        // Update existing car
        await axios.put(`${API_URL}/${editId}`, {
          PlateNumber: plateNumber,
          OwnerName: ownerName,
        });
        alert('Car updated');
      } else {
        // Create new car
        await axios.post(API_URL, {
          PlateNumber: plateNumber,
          OwnerName: ownerName,
        });
        alert('Car registered');
      }
      setPlateNumber('');
      setOwnerName('');
      setEditId(null);
      fetchCars();
    } catch {
      alert(editId ? 'Failed to update car' : 'Failed to register car');
    } finally {
      setLoading(false);
    }
  };

  // Delete car
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this car?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCars();
    } catch {
      alert('Delete failed');
    }
  };

  // Start editing a car
  const handleEdit = (car) => {
    setPlateNumber(car.PlateNumber);
    setOwnerName(car.OwnerName);
    setEditId(car.id);
  };

  // Cancel editing
  const cancelEdit = () => {
    setPlateNumber('');
    setOwnerName('');
    setEditId(null);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Registered Cars</h2>

      {/* Car Registration / Edit Form */}
      <form onSubmit={handleSubmit} className="mb-4 row g-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Plate Number"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (editId ? 'Updating...' : 'Registering...') : editId ? 'Update Car' : 'Register Car'}
          </button>
          {editId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Car List */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Plate Number</th>
            <th>Owner Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No cars found.
              </td>
            </tr>
          ) : (
            cars.map((car, index) => (
              <tr key={car.id}>
                <td>{index + 1}</td>
                <td>{car.PlateNumber}</td>
                <td>{car.OwnerName}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(car)}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(car.id)}
                    disabled={loading}
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
  );
}
