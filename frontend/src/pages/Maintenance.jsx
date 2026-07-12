import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { fetchVehicles } from '../services/mockApi';

function Maintenance() {
  const [vehicles, setVehicles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    description: '',
  });

  useEffect(() => {
    fetchVehicles().then((data) => setVehicles(data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vehicle = vehicles.find((v) => v.id === Number(formData.vehicle_id));

    const newLog = {
      id: Date.now(),
      vehicle_name: vehicle ? vehicle.name : 'Unknown',
      description: formData.description,
      status: 'Active',
    };

    setLogs([...logs, newLog]);
    console.log('Maintenance log created, vehicle status → In Shop:', newLog);

    setShowForm(false);
    setFormData({ vehicle_id: '', description: '' });
  };

  const handleClose = (id) => {
    setLogs(logs.map((log) => (log.id === id ? { ...log, status: 'Closed' } : log)));
    console.log('Maintenance closed, vehicle status → Available:', id);
  };

  const getStatusClass = (status) => {
    if (status === 'Active') return 'badge badge-orange';
    if (status === 'Closed') return 'badge badge-green';
    return 'badge';
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Maintenance</h1>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            + Log Service Record
          </button>
        </div>

        {showForm && (
          <form className="inline-form" onSubmit={handleSubmit}>
            <select name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} required>
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.reg_number})
                </option>
              ))}
            </select>
            <input
              type="text"
              name="description"
              placeholder="Service Description (e.g. Oil Change)"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn-primary">
              Log
            </button>
          </form>
        )}

        <table className="data-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.vehicle_name}</td>
                <td>{log.description}</td>
                <td>
                  <span className={getStatusClass(log.status)}>{log.status}</span>
                </td>
                <td>
                  {log.status === 'Active' && (
                    <button className="btn-primary" onClick={() => handleClose(log.id)}>
                      Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Maintenance;