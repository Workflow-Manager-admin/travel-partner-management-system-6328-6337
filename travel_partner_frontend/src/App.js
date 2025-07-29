import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import DashboardNav from "./components/DashboardNav";
import ThemeToggler from "./components/ThemeToggler";
import StatCard from "./components/StatCard";
import { API_BASE } from "./utils/api";
import { loadToken, authHeader } from "./utils/authHeader";

// --- Theme Context for Light Theme ---
export const ThemeContext = createContext();

// --- Auth Context ---
const AuthContext = createContext();

function useAuth() {
  return useContext(AuthContext);
}

// ---- AUTH LOGIC ----
function saveToken(token) {
  localStorage.setItem("authToken", token);
}
function clearToken() {
  localStorage.removeItem("authToken");
}

// ---- DASHBOARD LAYOUT ----
function DashboardLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="dashboard-root">
      <DashboardNav
        logout={logout}
        bottomContent={<ThemeToggler ThemeContext={ThemeContext} />}
      />
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <h2>Welcome{user && user.name ? `, ${user.name}` : ""}!</h2>
        </div>
        <div className="dashboard-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// ---- LOGIN / REGISTER PAGES ----
function LoginPage() {
  const { login } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      // Replace with backend API authentication
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (resp.ok) {
        const data = await resp.json();
        login(data.token, data.user);
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  // PUBLIC_INTERFACE
  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button type="submit" className="btn-primary" disabled={pending}>{pending ? "Signing in..." : "Sign In"}</button>
      </form>
      <div className="auth-switch">
        Don't have an account? <a href="/register">Register</a>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      // Replace with backend register endpoint
      const resp = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (resp.ok) {
        const data = await resp.json();
        login(data.token, data.user);
      } else {
        setError("Registration failed");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  function onChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button type="submit" className="btn-primary" disabled={pending}>{pending ? "Registering..." : "Register"}</button>
      </form>
      <div className="auth-switch">
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
}

// ---- FEATURE PAGES ----

// PUBLIC_INTERFACE
function DashboardHome() {
  // Replace stats with API if needed in future.
  return (
    <div>
      <h3>Quick Stats</h3>
      <div className="stats-cards">
        <StatCard label="Bookings" value="24" color="var(--color-primary)" />
        <StatCard label="Destinations" value="12" color="var(--color-secondary)" />
        <StatCard label="Planned Trips" value="8" color="var(--color-accent)" />
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDest() {
      setLoading(true);
      try {
        const resp = await fetch(`${API_BASE}/destinations`);
        if (resp.ok) {
          setDestinations(await resp.json());
        } else {
          setDestinations([]);
        }
      } catch {
        setDestinations([]);
      }
      setLoading(false);
    }
    fetchDest();
  }, []);

  return (
    <div>
      <h3>Discover Destinations</h3>
      <div className="destination-list">
        {loading && <div>Loading...</div>}
        {!loading && destinations.length === 0 && <div>No destinations found.</div>}
        {destinations.map(dest =>
          <div className="destination-card" key={dest.id}>
            <div className="destination-name">{dest.name}</div>
            <div className="destination-desc">{dest.description}</div>
            {dest.image && <img className="destination-img" src={dest.image} alt={dest.name} />}
          </div>
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const resp = await fetch(`${API_BASE}/bookings`, { headers: authHeader() });
        if (resp.ok) {
          setBookings(await resp.json());
        } else {
          setBookings([]);
        }
      } catch {
        setBookings([]);
      }
      setLoading(false);
    }
    fetchBookings();
  }, []);

  return (
    <div>
      <h3>My Bookings</h3>
      {loading && <div>Loading...</div>}
      {!loading && bookings.length === 0 && <div>No bookings yet.</div>}
      <div className="booking-list">
        {bookings.map(bk =>
          <div className="booking-card" key={bk.id}>
            <div><b>{bk.destination}</b> {bk.date && <span>({bk.date})</span>}</div>
            <div>Status: <strong>{bk.status}</strong></div>
            <div>Reference: {bk.reference}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ItineraryPage() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItins() {
      setLoading(true);
      try {
        const resp = await fetch(`${API_BASE}/itineraries`, { headers: authHeader() });
        if (resp.ok) {
          setItineraries(await resp.json());
        } else {
          setItineraries([]);
        }
      } catch {
        setItineraries([]);
      }
      setLoading(false);
    }
    fetchItins();
  }, []);

  return (
    <div>
      <h3>Itinerary Planner</h3>
      {loading && <div>Loading...</div>}
      {!loading && itineraries.length === 0 && <div>No itineraries yet.</div>}
      <div className="itinerary-list">
        {itineraries.map(itin =>
          <div className="itinerary-card" key={itin.id}>
            <div className="itin-title"><b>{itin.title}</b></div>
            <div>Start: {itin.startDate} - End: {itin.endDate}</div>
            <div>{itin.notes}</div>
            <div>Bookings: {itin.bookings.join(", ")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ProfilePage() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user || {});
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // PUBLIC_INTERFACE
  async function handleUpdate(e) {
    e.preventDefault();
    setStatus(null);
    try {
      const resp = await fetch(`${API_BASE}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(form),
      });
      if (resp.ok) {
        const upd = await resp.json();
        setUser(upd);
        setEditing(false);
        setStatus("Profile updated!");
      } else {
        setStatus("Failed to update profile");
      }
    } catch {
      setStatus("Network error");
    }
  }

  if (!user) return null;
  return (
    <div>
      <h3>Profile</h3>
      <form className="profile-form" onSubmit={handleUpdate}>
        <input name="name" value={form.name || ""} onChange={handleChange} disabled={!editing} placeholder="Name" />
        <input name="email" value={form.email || ""} onChange={handleChange} disabled placeholder="Email" />
        {editing && <button type="submit" className="btn-primary">Save</button>}
        {!editing && <button type="button" className="btn-secondary" onClick={() => setEditing(true)}>Edit</button>}
        {status && <div className="profile-status">{status}</div>}
      </form>
    </div>
  );
}

// ---- AUTH PROVIDER ----
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // PUBLIC_INTERFACE
  function login(token, userData) {
    saveToken(token);
    setUser(userData);
  }

  // PUBLIC_INTERFACE
  function logout() {
    clearToken();
    setUser(null);
  }

  useEffect(() => {
    // Try to auto-authenticate from token
    async function loadProfile() {
      const token = loadToken();
      if (token) {
        try {
          const resp = await fetch(`${API_BASE}/user/profile`, { headers: authHeader() });
          if (resp.ok) {
            setUser(await resp.json());
          } else {
            clearToken();
          }
        } catch {
          clearToken();
        }
      }
      setReady(true);
    }
    loadProfile();
  }, []);

  if (!ready) return <div className="loading">Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---- AUTH GUARD ----
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = window.location; // useLocation fails at module level sometimes
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// ---- THEME PROVIDER ----
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  function toggleTheme() {
    setTheme(t => (t === "light" ? "dark" : "light"));
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ---- APP ----
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/itinerary" element={<ItineraryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Route>
            <Route path="*" element={<div>404: Not found</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
