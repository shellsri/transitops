import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { fetchDrivers, createDriver } from '../services/mockApi';

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    license_expiry: '',
    contact: '',
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = () => {
    fetchDrivers().then((data) => setDrivers(data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createDriver(formData).then(() => {
      loadDrivers();
      setShowForm(false);
      setFormData({ name: '', license_number: '', license_expiry: '', contact: '' });
    });
  };

  const isLicenseExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const getStatusClass = (status) => {
    if (status === 'Available') return 'badge badge-green';
    if (status === 'On Trip') return 'badge badge-blue';
    if (status === 'Off Duty') return 'badge badge-orange';
    if (status === 'Suspended') return 'badge badge-red';
    return 'badge';
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Drivers & Safety Profiles</h1>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            + Add Driver
          </button>
        </div>

        {showForm && (
          <form className="inline-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Driver Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="license_number"
              placeholder="License Number"
              value={formData.license_number}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="license_expiry"
              value={formData.license_expiry}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn-primary">
              Save
            </button>
          </form>
        )}

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>License No.</th>
              <th>License Expiry</th>
              <th>Contact</th>
              <th>Safety Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.license_number}</td>
                <td>
                  {d.license_expiry}
                  {isLicenseExpired(d.license_expiry) && (
                    <span className="badge badge-red" style={{ marginLeft: 8 }}>
                      Expired
                    </span>
                  )}
                </td>
                <td>{d.contact}</td>
                <td>{d.safety_score}</td>
                <td>
                  <span className={getStatusClass(d.status)}>{d.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Drivers;