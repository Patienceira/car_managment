import React from 'react';

const Home = () => {
  return (
    <div className="text-center px-4 py-5" style={{ color: '#2c3e50' }}>
      <h1 className="mb-3 fw-bold display-5 text-primary">Welcome to Parking Manager</h1>
      <p className="lead mb-5 text-muted">
        Effortlessly manage your parking spaces, cars, and payments all in one place.
      </p>

      <div className="row justify-content-center g-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="card-body text-center">
              <i className="bi bi-car-front-fill fs-1 text-danger mb-3"></i>
              <h5 className="card-title">Manage Cars</h5>
              <p className="card-text">Easily track all vehicles in your parking lot.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="card-body text-center">
              <i className="bi bi-columns-gap fs-1 text-primary mb-3"></i>
              <h5 className="card-title">Parking Slots</h5>
              <p className="card-text">View and manage all parking slots efficiently.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="card-body text-center">
              <i className="bi bi-credit-card fs-1 text-warning mb-3"></i>
              <h5 className="card-title">Payments</h5>
              <p className="card-text">Track and manage all payments with ease.</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-secondary fst-italic">Use the navigation bar above to get started.</p>
    </div>
  );
};

export default Home;
