import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">TransitOps</h2>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          Dashboard
        </NavLink>
        <NavLink to="/vehicles" className="sidebar-link">
          Fleet
        </NavLink>
        <NavLink to="/drivers" className="sidebar-link">
          Drivers
        </NavLink>
        <NavLink to="/trips" className="sidebar-link">
          Trips
        </NavLink>
        <NavLink to="/maintenance" className="sidebar-link">
          Maintenance
        </NavLink>
        <NavLink to="/reports" className="sidebar-link">
          Analytics
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;