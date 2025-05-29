import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Home from './Home';
import Cars from './Cars';
import Parking from './Parking';
import Payments from './Payments';
import ParkingSlots from './ParkingSlots';
import Login from './Login';
import NotFound from './NotFound';
import Report from './Report';

const navBarStyle = {
  background: 'linear-gradient(90deg, #232526, #414345)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const tooltipTriggerList = [...document.querySelectorAll('[data-bs-toggle="tooltip"]')];
    tooltipTriggerList.forEach((t) => new bootstrap.Tooltip(t));
  }, [location]);

  const hideNavFooter = location.pathname === '/login';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: 'bi-house-fill', tooltip: 'Home' },
    { path: '/cars', label: 'Cars', icon: 'bi-car-front-fill', tooltip: 'Cars' },
    { path: '/parking', label: 'Parking', icon: 'bi-grid-3x3-gap-fill', tooltip: 'Parking' },
    { path: '/payments', label: 'Payments', icon: 'bi-credit-card-2-front-fill', tooltip: 'Payments' },
    { path: '/parkingslots', label: 'Slots', icon: 'bi-columns-gap', tooltip: 'Slots' },
    { path: '/report', label: 'Report', icon: 'bi-bar-chart-fill', tooltip: 'Report' },
  ];

  const activeStyle = {
    color: '#f39c12',
    fontWeight: 'bold',
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: '#f4f6f8' }}>
      {!hideNavFooter && (
        <nav className="navbar navbar-expand-lg navbar-dark" style={navBarStyle}>
          <div className="container-fluid">
            <Link className="navbar-brand d-flex align-items-center fs-4" to="/" style={{ color: '#f39c12', fontWeight: '700' }}>
              <i className="bi bi-car-front-fill me-2 fs-3"></i> Parking Manager
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                {navLinks.map(({ path, label, icon, tooltip }) => (
                  <li className="nav-item mx-2" key={path}>
                    <Link
                      to={path}
                      className="nav-link text-white position-relative"
                      data-bs-toggle="tooltip"
                      title={tooltip}
                      style={location.pathname === path ? activeStyle : {}}
                    >
                      <i className={`${icon} me-1`}></i> {label}
                      {location.pathname === path && (
                        <div
                          className="position-absolute bottom-0 start-50 translate-middle-x"
                          style={{ width: '50%', height: '2px', backgroundColor: '#f39c12' }}
                        />
                      )}
                    </Link>
                  </li>
                ))}
                <li className="nav-item ms-3">
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline-warning"
                    data-bs-toggle="tooltip"
                    title="Logout"
                  >
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}

      <main
        className="container my-4 p-4 rounded shadow"
        data-aos="fade-up"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          minHeight: '70vh',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/parking" element={<Parking />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/parkingslots" element={<ParkingSlots />} />
          <Route path="/report" element={<Report />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideNavFooter && (
        <footer
          className="text-white text-center py-3 mt-auto"
          style={{
            background: 'linear-gradient(90deg, #f39c12, #e74c3c)',
            boxShadow: '0 -3px 8px rgba(0,0,0,0.25)',
          }}
        >
          <div className="container">
            <p className="mb-1 fw-bold">&copy; {new Date().getFullYear()} Parking Manager</p>
            <p className="mb-0">
              <a href="#" className="text-white mx-2" title="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-white mx-2" title="Twitter">
                <i className="bi bi-twitter fs-5"></i>
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
