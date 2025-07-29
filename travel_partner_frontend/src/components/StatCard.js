import React from "react";

/**
 * PUBLIC_INTERFACE
 * Displays a stat card with a label and value, customizable color bar.
 * @param {string} label - The label of the stat.
 * @param {string|number} value - The main value to display.
 * @param {string} color - The accent color for the card bar.
 */
function StatCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ borderBottom: `4px solid ${color}` }}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
export default StatCard;
