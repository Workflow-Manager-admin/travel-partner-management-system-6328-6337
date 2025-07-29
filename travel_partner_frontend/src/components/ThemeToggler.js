import React, { useContext } from "react";

// PUBLIC_INTERFACE
/**
 * Renders a theme toggle button to switch between light and dark mode.
 * Uses ThemeContext from App.
 * @returns {JSX.Element}
 */
function ThemeToggler({ ThemeContext }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Change Theme">
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}

export default ThemeToggler;
