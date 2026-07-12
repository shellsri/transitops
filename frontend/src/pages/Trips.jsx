import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { fetchTrips, createTrip, dispatchTrip, fetchVehicles, fetchDrivers } from '../services/mockApi';

function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicle_id: '',
    driver_id: '',
    cargo_weight: '',
    distance: '',
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = () => {
    fetchTrips().then((data) => setTrips(data));
    fetchVehicles().then((data) => setVehicles(data));
    fetchDrivers().then((data) => setDrivers(data));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation: cargo weight vs vehicle max load
    const selectedVehicle = vehicles.find((v) => v.id === Number(formData.vehicle_id));
    if (selectedVehicle && Number(formData.cargo_weight) > selectedVehicle.max_load) {
      alert(`Cargo weight exceeds vehicle's max load capacity (${selectedVehicle.max_load} kg)`);
      return;
    }

    createTrip({
      ...formData,
      vehicle_id: Number(formData.vehicle_id),
      driver_id: Number(formData.driver_id),
      cargo_weight: Number(formData.cargo_weight),
      distance: Number(formData.distance),
    }).then(() => {
      loadAll();
      setShowForm(false);
      setFormData({ source: '', destination: '', vehicle_id: '', driver_id: '', cargo_weight: '', distance: '' });
    });
  };

  const handleDispatch = (id) => {
    dispatchTrip(id).then(() => loadAll());
  };

  const getVehicleName = (id) => {
    const v = vehicles.find((v) => v.id === id);
    return v ? v.name : '—';
  };

  const getDriverName = (id) => {
    const d = drivers.find((d) => d.id === id);
    return d ? d.name : '—';
  };

  const getStatusClass = (status) => {
    if (status === 'Draft') return 'badge badge-orange';
    if (status === 'Dispatched') return 'badge badge-blue';
    if (status === 'Completed') return 'badge badge-green';
    if (status === 'Cancelled') return 'badge badge-red';
    return 'badge';
  };

  // Only show Available vehicles/drivers in dropdowns
  const availableVehicles = vehicles.filter((v) => v.status === 'Available');
  const availableDrivers = drivers.filter((d) => d.status === 'Available');

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>Trip Dispatcher</h1>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            + Create Trip
          </button>
        </div>

        {showForm && (
          <form className="inline-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="source"
              placeholder="Source"
              value={formData.source}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="destination"
              placeholder="Destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />
            <select name="vehicle_id" value={formData.vehicle_id} onChange={handleChange} required>
              <option value="">Select Vehicle</option>
              {availableVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.max_load} kg)
                </option>
              ))}
            </select>
            <select name="driver_id" value={formData.driver_id} onChange={handleChange} required>
              <option value="">Select Driver</option>
              {availableDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="cargo_weight"
              placeholder="Cargo Weight (kg)"
              value={formData.cargo_weight}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="distance"
              placeholder="Distance (km)"
              value={formData.distance}
              onChange={handleChange}
              required
            />
            <button type="submit" className="btn-primary">
              Create Trip
            </button>
          </form>
        )}

        <table className="data-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Destination</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Cargo</th>
              <th>Distance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => (
              <tr key={t.id}>
                <td>{t.source}</td>
                <td>{t.destination}</td>
                <td>{getVehicleName(t.vehicle_id)}</td>
                <td>{getDriverName(t.driver_id)}</td>
                <td>{t.cargo_weight} kg</td>
                <td>{t.distance} km</td>
                <td>
                  <span className={getStatusClass(t.status)}>{t.status}</span>
                </td>
                <td>
                  {t.status === 'Draft' && (
                    <button className="btn-primary" onClick={() => handleDispatch(t.id)}>
                      Dispatch
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

export default Trips;