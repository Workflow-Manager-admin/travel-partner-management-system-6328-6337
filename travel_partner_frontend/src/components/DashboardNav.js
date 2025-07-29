import React from "react";
import { Link, useLocation } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * Renders the dashboard side navigation with icons and highlights for active route.
 * @param {function} logout - Callback for logout action.
 * @param {React.Node} bottomContent - Optional react node for nav bottom (such as theme toggler).
 */
function DashboardNav({ logout, bottomContent }) {
  const location = useLocation();
  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "🏠" },
    { to: "/destinations", label: "Destinations", icon: "🌍" },
    { to: "/bookings", label: "Bookings", icon: "✈️" },
    { to: "/itinerary", label: "Itinerary", icon: "🗺️" },
    { to: "/profile", label: "Profile", icon: "👤" }
  ];

  return (
    <aside className="dashboard-sidenav">
      <div className="dashboard-logo">
        <span style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: 20 }}>
          TravelPartner
        </span>
      </div>
      <ul className="dashboard-navlist">
        {navLinks.map(link => (
          <li key={link.to} className={location.pathname === link.to ? "active" : ""}>
            <Link to={link.to}>
              <span className="dashboard-icon">{link.icon}</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="dashboard-sidenav-bottom">
        {bottomContent}
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}

export default DashboardNav;
