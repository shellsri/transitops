import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  fetchTrips,
  createTrip,
  dispatchTrip,
  fetchVehicles,
  fetchDrivers,
} from "../services/realApi";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    vehicle_id: "",
    driver_id: "",
    cargo_weight: "",
    distance: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);

      const [tripData, vehicleData, driverData] =
        await Promise.all([
          fetchTrips(),
          fetchVehicles(),
          fetchDrivers(),
        ]);

      setTrips(
        Array.isArray(tripData)
          ? tripData
          : tripData.data || []
      );

      setVehicles(
        Array.isArray(vehicleData)
          ? vehicleData
          : vehicleData.data || []
      );

      setDrivers(
        Array.isArray(driverData)
          ? driverData
          : driverData.data || []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const vehicle = vehicles.find(
      (v) => v.id === Number(formData.vehicle_id)
    );

    if (
      vehicle &&
      Number(formData.cargo_weight) >
        Number(vehicle.max_load)
    ) {
      alert(
        `Cargo exceeds max load (${vehicle.max_load} kg)`
      );
      return;
    }

    try {
      await createTrip({
        ...formData,
        vehicle_id: Number(formData.vehicle_id),
        driver_id: Number(formData.driver_id),
        cargo_weight: Number(formData.cargo_weight),
        distance: Number(formData.distance),
      });

      setFormData({
        source: "",
        destination: "",
        vehicle_id: "",
        driver_id: "",
        cargo_weight: "",
        distance: "",
      });

      setShowForm(false);

      loadAll();
    } catch (err) {
      console.error(err);
      alert("Unable to create trip.");
    }
  }

  async function handleDispatch(id) {
    try {
      await dispatchTrip(id);
      loadAll();
    } catch (err) {
      console.error(err);
    }
  }

  function vehicleName(id) {
    const v = vehicles.find((x) => x.id === id);
    return v?.name || "-";
  }

  function driverName(id) {
    const d = drivers.find((x) => x.id === id);
    return d?.name || "-";
  }

  function badge(status) {
    switch ((status || "").toLowerCase()) {
      case "draft":
        return "badge badge-orange";

      case "dispatched":
      case "active":
        return "badge badge-blue";

      case "completed":
        return "badge badge-green";

      case "cancelled":
        return "badge badge-red";

      default:
        return "badge";
    }
  }

  const availableVehicles = vehicles.filter(
    (v) =>
      (v.status || "").toLowerCase() === "available"
  );

  const availableDrivers = drivers.filter(
    (d) =>
      (d.status || "").toLowerCase() === "available"
  );

  return (
    <div className="page-layout">
      <Sidebar />

      <div className="main-content">

        <div className="page-header">

          <div>
            <h1>Trip Dispatcher</h1>

            <p
              style={{
                color: "#9ca3af",
                marginTop: 6,
              }}
            >
              Create, dispatch and monitor fleet trips.
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Close"
              : "+ Create Trip"}
          </button>

        </div>

        {showForm && (
          <form
            className="inline-form"
            onSubmit={handleSubmit}
          >

            <input
              name="source"
              placeholder="Source"
              value={formData.source}
              onChange={handleChange}
              required
            />

            <input
              name="destination"
              placeholder="Destination"
              value={formData.destination}
              onChange={handleChange}
              required
            />

            <select
              name="vehicle_id"
              value={formData.vehicle_id}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Vehicle
              </option>

              {availableVehicles.map((v) => (
                <option
                  key={v.id}
                  value={v.id}
                >
                  {v.name} ({v.max_load}kg)
                </option>
              ))}
            </select>

            <select
              name="driver_id"
              value={formData.driver_id}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Driver
              </option>

              {availableDrivers.map((d) => (
                <option
                  key={d.id}
                  value={d.id}
                >
                  {d.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="cargo_weight"
              placeholder="Cargo Weight"
              value={formData.cargo_weight}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="distance"
              placeholder="Distance"
              value={formData.distance}
              onChange={handleChange}
              required
            />

            <button className="btn-primary">
              Save Trip
            </button>

          </form>
        )}

        {loading ? (
          <div
            style={{
              marginTop: 70,
              textAlign: "center",
              color: "#9ca3af",
            }}
          >
            Loading trips...
          </div>
        ) : trips.length === 0 ? (
          <div
            style={{
              marginTop: 80,
              textAlign: "center",
            }}
          >
            <h2>No Trips Found</h2>

            <p
              style={{
                color: "#9ca3af",
              }}
            >
              Create your first trip to start
              dispatching vehicles.
            </p>
          </div>
        ) : (
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
                <th></th>
              </tr>
            </thead>

            <tbody>

              {trips.map((trip) => (
                <tr key={trip.id}>

                  <td>{trip.source}</td>

                  <td>{trip.destination}</td>

                  <td>
                    {vehicleName(
                      trip.vehicle_id
                    )}
                  </td>

                  <td>
                    {driverName(
                      trip.driver_id
                    )}
                  </td>

                  <td>
                    {trip.cargo_weight} kg
                  </td>

                  <td>
                    {trip.distance} km
                  </td>

                  <td>
                    <span
                      className={badge(
                        trip.status
                      )}
                    >
                      {trip.status}
                    </span>
                  </td>

                  <td>

                    {trip.status ===
                      "Draft" && (
                      <button
                        className="btn-primary"
                        onClick={() =>
                          handleDispatch(
                            trip.id
                          )
                        }
                      >
                        Dispatch
                      </button>
                    )}

                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}

export default Trips;