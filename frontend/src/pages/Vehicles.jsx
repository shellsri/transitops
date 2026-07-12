import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { fetchVehicles, createVehicle } from '../services/realApi';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reg_number: '',
    name: '',
    type: 'Van',
    max_load: '',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    fetchVehicles().then((data) => setVehicles(data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createVehicle(formData).then(() => {
      loadVehicles();
      setShowForm(false);
      setFormData({ reg_number: '', name: '', type: 'Van', max_load: '' });
    });
  };

  const getStatusClass = (status) => {
    if (status === 'Available') return 'badge badge-green';
    if (status === 'On Trip') return 'badge badge-blue';
    if (status === 'In Shop') return 'badge badge-orange';
    if (status === 'Retired') return 'badge badge-red';
    return 'badge';
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Vehicle Registry</h1>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            + Add Vehicle
          </button>
        </div>

        {showForm && (
          <form className="inline-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="reg_number"
              placeholder="Registration Number"
              value={formData.reg_number}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Vehicle Name/Model"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
              <option value="Bike">Bike</option>
            </select>
            <input
              type="number"
              name="max_load"
              placeholder="Max Load (kg)"
              value={formData.max_load}
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
              <th>Reg. Number</th>
              <th>Name</th>
              <th>Type</th>
              <th>Max Load</th>
              <th>Odometer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.reg_number}</td>
                <td>{v.name}</td>
                <td>{v.type}</td>
                <td>{v.max_load} kg</td>
                <td>{v.odometer}</td>
                <td>
                  <span className={getStatusClass(v.status)}>{v.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Vehicles;