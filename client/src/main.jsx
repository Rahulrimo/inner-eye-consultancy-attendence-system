import React, { useEffect, useState } from "react";
import {
  createRoot
} from "react-dom/client";

import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Users,
  FileText,
  Clock3,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  BriefcaseBusiness,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  Timer,
  ArrowRight,
  Search,
  Settings,
  CircleUserRound
} from "lucide-react";

import "./styles.css";

const API = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

async function api(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

/* =========================================================
   AUTH
========================================================= */

function Auth({ onLogin }) {
  const [portal, setPortal] = useState(null);
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "login"
          ? "/auth/login"
          : "/auth/register";

      const body =
        mode === "login"
          ? {
              email: form.email,
              password: form.password
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password
            };

      const data = await api(endpoint, {
        method: "POST",
        body: JSON.stringify(body)
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  /* FIRST PAGE — PORTAL SELECTION */
  if (!portal) {
    return (
      <div className="portal-page">
        <div className="portal-header">
          <div className="brand-mark">IE</div>

          <div>
            <h1>Attendance Management System</h1>
            <p>Inner Eye Consultancy Services LLP</p>
          </div>
        </div>

        <div className="portal-content">
          <div className="portal-title">
            <span>SECURE WORKFORCE PLATFORM</span>
            <h2>Select your portal</h2>
            <p>
              Choose the appropriate portal to continue to the
              Attendance Management System.
            </p>
          </div>

          <div className="portal-cards">
            <div className="portal-card hr-card">
              <div className="portal-icon">
                <ShieldCheck size={38} />
              </div>

              <div className="portal-label">HR PORTAL</div>

              <h3>Human Resources</h3>

              <p>
                Manage employees, attendance records, leave
                requests and workforce operations.
              </p>

              <button
                className="portal-button dark-button"
                onClick={() => {
                  setPortal("hr");
                  setMode("login");
                }}
              >
                Continue as HR
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="portal-card employee-card">
              <div className="portal-icon employee-icon">
                <CircleUserRound size={38} />
              </div>

              <div className="portal-label">EMPLOYEE PORTAL</div>

              <h3>Employee Self Service</h3>

              <p>
                Track attendance, working hours, leave balance
                and personal employment information.
              </p>

              <button
                className="portal-button light-button"
                onClick={() => {
                  setPortal("employee");
                  setMode("login");
                }}
              >
                Continue as Employee
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="portal-footer">
            <span>© 2026 Inner Eye Consultancy Services LLP</span>
            <span>Secure • Professional • Reliable</span>
          </div>
        </div>
      </div>
    );
  }

  /* LOGIN / REGISTRATION */
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-mark">IE</div>

          <div>
            <strong>Attendance Hub</strong>
            <span>Inner Eye Consultancy Services LLP</span>
          </div>
        </div>

        <div className="auth-intro">
          <div className="small-label">
            {portal === "hr" ? "HR PORTAL" : "EMPLOYEE PORTAL"}
          </div>

          <h1>
            {portal === "hr"
              ? "Workforce Administration"
              : "Employee Self Service"}
          </h1>

          <p>
            A secure workplace platform for attendance,
            working hours and leave management.
          </p>
        </div>

        <div className="auth-features">
          <div>
            <CheckCircle2 size={18} />
            Secure attendance records
          </div>

          <div>
            <CheckCircle2 size={18} />
            Real-time workforce tracking
          </div>

          <div>
            <CheckCircle2 size={18} />
            Centralized leave management
          </div>
        </div>
      </div>

      <div className="auth-right">
        <button
          className="back-button"
          onClick={() => {
            setPortal(null);
            setError("");
          }}
        >
          ← Back to portal selection
        </button>

        <div className="login-box">
          <div className="login-heading">
            <span>
              {mode === "login"
                ? "WELCOME BACK"
                : "CREATE ACCOUNT"}
            </span>

            <h2>
              {mode === "login"
                ? "Sign in to your account"
                : "Register as an employee"}
            </h2>

            <p>
              {mode === "login"
                ? "Enter your credentials to access the system."
                : "Create your employee account to continue."}
            </p>
          </div>

          {error && (
            <div className="error-box">
              <XCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            {mode === "register" && (
              <label>
                Full Name
                <input
                  value={form.name}
                  onChange={(e) =>
                    update("name", e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                />
              </label>
            )}

            <label>
              Email Address
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  update("email", e.target.value)
                }
                placeholder="name@company.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  update("password", e.target.value)
                }
                placeholder="Enter your password"
                required
              />
            </label>

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {portal === "employee" && (
            <button
              className="switch-auth"
              onClick={() =>
                setMode(
                  mode === "login"
                    ? "register"
                    : "login"
                )
              }
            >
              {mode === "login"
                ? "New employee? Create an account"
                : "Already have an account? Sign in"}
            </button>
          )}

          {portal === "hr" && (
            <div className="hr-login-note">
              <ShieldCheck size={18} />
              HR access is restricted to authorized
              personnel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App({ user, onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  const isHR = user?.role === "hr";

  const employeeNav = [
    {
      id: "dashboard",
      label: "Overview",
      icon: LayoutDashboard
    },
    {
      id: "attendance",
      label: "My Attendance",
      icon: CalendarCheck
    },
    {
      id: "leave",
      label: "Leave Requests",
      icon: CalendarDays
    }
  ];

  const hrNav = [
    {
      id: "dashboard",
      label: "HR Overview",
      icon: LayoutDashboard
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: CalendarCheck
    },
    {
      id: "leave",
      label: "Leave Management",
      icon: CalendarDays
    },
    {
      id: "hr",
      label: "Employees",
      icon: Users
    }
  ];

  const nav = isHR ? hrNav : employeeNav;

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  }

  function navigate(id) {
    setActive(id);
    setMobileMenu(false);
  }

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside
        className={`sidebar ${
          mobileMenu ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-mark">IE</div>

          <div>
            <strong>Attendance Hub</strong>
            <span>Workforce Management</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-title">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          {nav.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={
                  active === item.id
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() => navigate(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-section-title">
            ACCOUNT
          </div>

          <button className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            className="nav-item logout-nav"
            onClick={logout}
          >
            <LogOut size={19} />
            <span>Sign out</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="security-status">
            <span className="online-dot"></span>
            System operational
          </div>

          <small>Version 1.0.0</small>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="topbar-kicker">
                {isHR
                  ? "HUMAN RESOURCES"
                  : "EMPLOYEE SELF SERVICE"}
              </div>

              <h1>
                {active === "dashboard"
                  ? isHR
                    ? "HR Overview"
                    : "Employee Overview"
                  : active === "attendance"
                  ? "Attendance"
                  : active === "leave"
                  ? isHR
                    ? "Leave Management"
                    : "Leave Requests"
                  : "Employee Directory"}
              </h1>
            </div>
          </div>

          <div className="topbar-right">
            <div className="date-display">
              <Clock3 size={17} />
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                }
              )}
            </div>

            <button className="notification-btn">
              <Bell size={19} />
              <span></span>
            </button>

            <div className="user-menu">
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>

              <div className="user-info">
                <strong>{user?.name || "User"}</strong>
                <span>
                  {isHR ? "HR Administrator" : "Employee"}
                </span>
              </div>

              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <main className="workspace">
          {active === "dashboard" && (
            isHR ? (
              <HRDashboard navigate={navigate} />
            ) : (
              <EmployeeDashboard
                user={user}
                navigate={navigate}
              />
            )
          )}

          {active === "attendance" && (
            <Attendance isHR={isHR} />
          )}

          {active === "leave" && (
            <Leave isHR={isHR} />
          )}

          {active === "hr" && isHR && (
            <HR />
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   EMPLOYEE DASHBOARD
========================================================= */

function EmployeeDashboard({ user, navigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const result = await api("/dashboard/employee");
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  const summary = data?.summary || {};

  return (
    <div className="dashboard-page">
      <div className="welcome-banner">
        <div>
          <div className="section-eyebrow">
            EMPLOYEE DASHBOARD
          </div>

          <h2>
            Good day, {user?.name?.split(" ")[0] || "Employee"}
          </h2>

          <p>
            Here is your attendance and workforce activity
            overview.
          </p>
        </div>

        <div className="welcome-icon">
          <BriefcaseBusiness size={42} />
        </div>
      </div>

      <div className="section-heading-row">
        <div>
          <h3>Attendance Overview</h3>
          <p>Current attendance performance</p>
        </div>

        <button
          className="outline-btn"
          onClick={() => navigate("attendance")}
        >
          View attendance
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="stats-grid employee-stats">
        <Stat
          label="Attendance Days"
          value={
            summary.attendanceDays ??
            summary.presentDays ??
            0
          }
          icon={CalendarCheck}
          tone="blue"
          description="Days present"
        />

        <Stat
          label="Working Hours"
          value={
            summary.workingHours ??
            summary.totalHours ??
            "0.00"
          }
          icon={Timer}
          tone="green"
          description="Total recorded hours"
        />

        <Stat
          label="Leave Balance"
          value={
            summary.leaveBalance ??
            summary.remainingLeave ??
            0
          }
          icon={CalendarDays}
          tone="orange"
          description="Available leave"
        />

        <Stat
          label="Attendance Rate"
          value={`${summary.attendancePercentage ?? 0}%`}
          icon={TrendingUp}
          tone="purple"
          description="Current attendance"
        />
      </div>

      <div className="dashboard-columns">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Today's Attendance</h3>
              <p>Your current attendance status</p>
            </div>

            <CalendarCheck size={20} />
          </div>

          <div className="today-attendance">
            <div className="today-status-icon">
              <CheckCircle2 size={28} />
            </div>

            <div>
              <strong>
                {data?.today?.checkIn
                  ? "Attendance Recorded"
                  : "Not Checked In"}
              </strong>

              <span>
                {data?.today?.checkIn
                  ? `Checked in at ${formatTime(
                      data.today.checkIn
                    )}`
                  : "Please check in when you begin work."}
              </span>
            </div>
          </div>

          <button
            className="primary-btn full-btn"
            onClick={() => navigate("attendance")}
          >
            Manage today's attendance
            <ArrowRight size={17} />
          </button>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Common employee activities</p>
            </div>

            <ClipboardList size={20} />
          </div>

          <div className="quick-actions">
            <button
              onClick={() => navigate("attendance")}
            >
              <div className="quick-icon blue">
                <CalendarCheck size={20} />
              </div>

              <div>
                <strong>Attendance</strong>
                <span>Check in / check out</span>
              </div>

              <ArrowRight size={17} />
            </button>

            <button
              onClick={() => navigate("leave")}
            >
              <div className="quick-icon orange">
                <CalendarDays size={20} />
              </div>

              <div>
                <strong>Request Leave</strong>
                <span>Submit a leave request</span>
              </div>

              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </div>

      <section className="panel recent-panel">
        <div className="panel-header">
          <div>
            <h3>Recent Attendance Activity</h3>
            <p>Your latest attendance records</p>
          </div>

          <button
            className="text-btn"
            onClick={() => navigate("attendance")}
          >
            View all
          </button>
        </div>

        <AttendanceTable
          rows={data?.recentAttendance || []}
          employeeView
        />
      </section>
    </div>
  );
}

/* =========================================================
   HR DASHBOARD
========================================================= */

function HRDashboard({ navigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const result = await api("/dashboard/hr");
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  const summary = data?.summary || {};

  return (
    <div className="dashboard-page">
      <div className="welcome-banner hr-welcome">
        <div>
          <div className="section-eyebrow">
            HR ADMINISTRATION
          </div>

          <h2>Workforce Overview</h2>

          <p>
            Monitor employee attendance, leave activity and
            workforce operations from one place.
          </p>
        </div>

        <div className="welcome-icon">
          <ShieldCheck size={42} />
        </div>
      </div>

      <div className="section-heading-row">
        <div>
          <h3>Today's Workforce</h3>
          <p>Real-time employee attendance summary</p>
        </div>

        <button
          className="outline-btn"
          onClick={() => navigate("attendance")}
        >
          Attendance records
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="stats-grid hr-stats">
        <Stat
          label="Total Employees"
          value={
            summary.totalEmployees ??
            summary.employeeCount ??
            0
          }
          icon={Users}
          tone="blue"
          description="Active employees"
        />

        <Stat
          label="Present Today"
          value={
            summary.presentToday ??
            summary.present ??
            0
          }
          icon={UserCheck}
          tone="green"
          description="Checked in"
        />

        <Stat
          label="Absent Today"
          value={
            summary.absentToday ??
            summary.absent ??
            0
          }
          icon={UserX}
          tone="red"
          description="Not checked in"
        />

        <Stat
          label="Pending Leaves"
          value={
            summary.pendingLeaves ??
            data?.pendingLeaves?.length ??
            0
          }
          icon={FileText}
          tone="orange"
          description="Awaiting approval"
        />
      </div>

      <div className="dashboard-columns">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Today's Attendance</h3>
              <p>Current workforce status</p>
            </div>

            <CalendarCheck size={20} />
          </div>

          <div className="attendance-summary">
            <div className="summary-line">
              <span>
                <i className="status-dot green-dot"></i>
                Present
              </span>

              <strong>
                {summary.presentToday ??
                  summary.present ??
                  0}
              </strong>
            </div>

            <div className="summary-line">
              <span>
                <i className="status-dot red-dot"></i>
                Absent
              </span>

              <strong>
                {summary.absentToday ??
                  summary.absent ??
                  0}
              </strong>
            </div>

            <div className="summary-line">
              <span>
                <i className="status-dot orange-dot"></i>
                On Leave
              </span>

              <strong>
                {summary.onLeave ?? 0}
              </strong>
            </div>
          </div>

          <button
            className="primary-btn full-btn"
            onClick={() => navigate("attendance")}
          >
            Open attendance records
            <ArrowRight size={17} />
          </button>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>HR Quick Actions</h3>
              <p>Manage workforce operations</p>
            </div>

            <Settings size={20} />
          </div>

          <div className="quick-actions">
            <button
              onClick={() => navigate("hr")}
            >
              <div className="quick-icon blue">
                <Users size={20} />
              </div>

              <div>
                <strong>Employee Directory</strong>
                <span>View employee information</span>
              </div>

              <ArrowRight size={17} />
            </button>

            <button
              onClick={() => navigate("leave")}
            >
              <div className="quick-icon orange">
                <FileText size={20} />
              </div>

              <div>
                <strong>Leave Management</strong>
                <span>Review pending requests</span>
              </div>

              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </div>

      <section className="panel recent-panel">
        <div className="panel-header">
          <div>
            <h3>Pending Leave Requests</h3>
            <p>Requests requiring HR attention</p>
          </div>

          <button
            className="text-btn"
            onClick={() => navigate("leave")}
          >
            Manage leaves
          </button>
        </div>

        <LeaveTable
          rows={data?.pendingLeaves || []}
          compact
        />
      </section>
    </div>
  );
}

/* =========================================================
   ATTENDANCE
========================================================= */

function Attendance({ isHR }) {
  const [rows, setRows] = useState([]);
  const [mine, setMine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
      if (isHR) {
        const result = await api("/attendance/all");
        setRows(result.attendance || result || []);
      } else {
        const result = await api("/attendance/mine");
        setRows(result.attendance || result || []);
        setMine(
          result.today ||
            result.current ||
            null
        );
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkIn() {
    setMessage("");

    try {
      await api("/attendance/check-in", {
        method: "POST"
      });

      setMessage("Check-in recorded successfully.");
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function checkOut() {
    setMessage("");

    try {
      await api("/attendance/check-out", {
        method: "POST"
      });

      setMessage("Check-out recorded successfully.");
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="content-page">
      <PageIntro
        eyebrow={isHR ? "ATTENDANCE ADMINISTRATION" : "MY ATTENDANCE"}
        title={
          isHR
            ? "Attendance Records"
            : "My Attendance"
        }
        description={
          isHR
            ? "Monitor employee attendance and working hours."
            : "Record your daily attendance and review your working history."
        }
      />

      {!isHR && (
        <section className="attendance-action-card">
          <div>
            <div className="section-eyebrow">
              TODAY
            </div>

            <h3>Daily Attendance</h3>

            <p>
              Record your start and end time for today's
              working session.
            </p>
          </div>

          <div className="attendance-actions">
            <button
              className="primary-btn"
              onClick={checkIn}
            >
              <CheckCircle2 size={18} />
              Check In
            </button>

            <button
              className="secondary-btn"
              onClick={checkOut}
            >
              <XCircle size={18} />
              Check Out
            </button>
          </div>
        </section>
      )}

      {message && (
        <div className="success-box">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {!isHR && mine && (
        <div className="mini-stats">
          <div>
            <span>Check In</span>
            <strong>
              {formatTime(
                mine.checkIn ||
                  mine.today?.checkIn
              ) || "--"}
            </strong>
          </div>

          <div>
            <span>Check Out</span>
            <strong>
              {formatTime(
                mine.checkOut ||
                  mine.today?.checkOut
              ) || "--"}
            </strong>
          </div>

          <div>
            <span>Working Hours</span>
            <strong>
              {fmtHours(
                mine.workingHours ||
                  mine.hours ||
                  0
              )}
            </strong>
          </div>
        </div>
      )}

      <section className="panel table-panel">
        <div className="panel-header">
          <div>
            <h3>
              {isHR
                ? "Employee Attendance"
                : "Attendance History"}
            </h3>

            <p>
              {isHR
                ? "Latest attendance activity across the organization."
                : "Your recent attendance records."}
            </p>
          </div>

          <div className="table-tools">
            <button className="icon-tool">
              <Search size={17} />
            </button>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <AttendanceTable rows={rows} />
        )}
      </section>
    </div>
  );
}

/* =========================================================
   LEAVE
========================================================= */

function Leave({ isHR }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
      const endpoint = isHR
        ? "/leaves/all"
        : "/leaves/mine";

      const result = await api(endpoint);

      setRows(
        result.leaves ||
          result ||
          []
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitLeave(e) {
    e.preventDefault();
    setMessage("");

    try {
      await api("/leaves", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setMessage(
        "Leave request submitted successfully."
      );

      setForm({
        startDate: "",
        endDate: "",
        reason: ""
      });

      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function updateLeave(id, status) {
    try {
      await api(`/leaves/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status
        })
      });

      setMessage(
        `Leave request ${status}.`
      );

      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="content-page">
      <PageIntro
        eyebrow={
          isHR
            ? "LEAVE ADMINISTRATION"
            : "EMPLOYEE SERVICES"
        }
        title={
          isHR
            ? "Leave Management"
            : "Leave Requests"
        }
        description={
          isHR
            ? "Review, approve and manage employee leave requests."
            : "Submit leave requests and track their approval status."
        }
      />

      {!isHR && (
        <section className="panel leave-form-panel">
          <div className="panel-header">
            <div>
              <h3>Submit Leave Request</h3>
              <p>
                Provide the details for your requested leave.
              </p>
            </div>

            <CalendarDays size={21} />
          </div>

          <form
            className="leave-form"
            onSubmit={submitLeave}
          >
            <label>
              Start Date
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate: e.target.value
                  })
                }
                required
              />
            </label>

            <label>
              End Date
              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    endDate: e.target.value
                  })
                }
                required
              />
            </label>

            <label className="reason-field">
              Reason
              <input
                value={form.reason}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reason: e.target.value
                  })
                }
                placeholder="Enter reason for leave"
                required
              />
            </label>

            <button
              className="primary-btn"
              type="submit"
            >
              Submit Request
            </button>
          </form>
        </section>
      )}

      {message && (
        <div className="success-box">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      <section className="panel table-panel">
        <div className="panel-header">
          <div>
            <h3>
              {isHR
                ? "Leave Requests"
                : "My Leave History"}
            </h3>

            <p>
              {isHR
                ? "Review employee leave requests."
                : "Track previously submitted requests."}
            </p>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <LeaveTable
            rows={rows}
            isHR={isHR}
            onUpdate={updateLeave}
          />
        )}
      </section>
    </div>
  );
}

/* =========================================================
   HR EMPLOYEE DIRECTORY
========================================================= */

function HR() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const result = await api("/dashboard/hr");

      setRows(
        result.employees ||
          result.users ||
          []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="content-page">
      <PageIntro
        eyebrow="WORKFORCE MANAGEMENT"
        title="Employee Directory"
        description="View and manage employee information across the organization."
      />

      <div className="directory-summary">
        <div>
          <Users size={21} />
          <span>Employee Records</span>
          <strong>{rows.length}</strong>
        </div>

        <div>
          <UserCheck size={21} />
          <span>Active Workforce</span>
          <strong>{rows.length}</strong>
        </div>

        <div>
          <ShieldCheck size={21} />
          <span>Access Control</span>
          <strong>Active</strong>
        </div>
      </div>

      <section className="panel table-panel">
        <div className="panel-header">
          <div>
            <h3>Employees</h3>
            <p>Registered employee accounts</p>
          </div>

          <button className="outline-btn">
            <Users size={16} />
            Employee Directory
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : rows.length === 0 ? (
          <EmptyState message="No employee records found." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Account</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <div className="employee-cell">
                        <div className="table-avatar">
                          {employee.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <strong>
                          {employee.name}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {employee.email}
                    </td>

                    <td>
                      <span className="role-badge">
                        {employee.role || "employee"}
                      </span>
                    </td>

                    <td>
                      <span className="status-badge approved">
                        Active
                      </span>
                    </td>

                    <td>
                      <span className="muted">
                        Registered
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function PageIntro({
  eyebrow,
  title,
  description
}) {
  return (
    <div className="page-intro">
      <div>
        <div className="section-eyebrow">
          {eyebrow}
        </div>

        <h2>{title}</h2>

        <p>{description}</p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  tone,
  description
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={21} />
      </div>

      <div className="stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </div>
  );
}

function AttendanceTable({
  rows,
  employeeView
}) {
  if (!rows?.length) {
    return (
      <EmptyState message="No attendance records available." />
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {!employeeView && <th>Employee</th>}
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Working Hours</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.slice(0, 10).map((row) => (
            <tr key={row._id}>
              {!employeeView && (
                <td>
                  <div className="employee-cell">
                    <div className="table-avatar">
                      {(
                        row.employee?.name ||
                        row.user?.name ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <strong>
                      {row.employee?.name ||
                        row.user?.name ||
                        "Employee"}
                    </strong>
                  </div>
                </td>
              )}

              <td>
                {formatDate(
                  row.date ||
                    row.createdAt
                )}
              </td>

              <td>
                {formatTime(row.checkIn) ||
                  "--"}
              </td>

              <td>
                {formatTime(row.checkOut) ||
                  "--"}
              </td>

              <td>
                {fmtHours(
                  row.workingHours ||
                    row.hours ||
                    0
                )}
              </td>

              <td>
                <span
                  className={`status-badge ${
                    row.checkOut
                      ? "approved"
                      : row.checkIn
                      ? "pending"
                      : "rejected"
                  }`}
                >
                  {row.checkOut
                    ? "Completed"
                    : row.checkIn
                    ? "Working"
                    : "Absent"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeaveTable({
  rows,
  isHR,
  onUpdate,
  compact
}) {
  if (!rows?.length) {
    return (
      <EmptyState message="No leave requests available." />
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {isHR && <th>Employee</th>}
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            {isHR && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {rows.slice(0, compact ? 5 : 20).map(
            (row) => (
              <tr key={row._id}>
                {isHR && (
                  <td>
                    <div className="employee-cell">
                      <div className="table-avatar">
                        {(
                          row.employee?.name ||
                          row.user?.name ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <strong>
                        {row.employee?.name ||
                          row.user?.name ||
                          "Employee"}
                      </strong>
                    </div>
                  </td>
                )}

                <td>
                  {formatDate(
                    row.startDate
                  )}
                </td>

                <td>
                  {formatDate(
                    row.endDate
                  )}
                </td>

                <td>
                  <span className="reason-text">
                    {row.reason || "—"}
                  </span>
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      row.status === "approved"
                        ? "approved"
                        : row.status === "rejected"
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {capitalize(
                      row.status || "pending"
                    )}
                  </span>
                </td>

                {isHR && (
                  <td>
                    {row.status === "pending" ? (
                      <div className="approval-actions">
                        <button
                          className="approve-btn"
                          onClick={() =>
                            onUpdate(
                              row._id,
                              "approved"
                            )
                          }
                        >
                          <CheckCircle2 size={15} />
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            onUpdate(
                              row._id,
                              "rejected"
                            )
                          }
                        >
                          <XCircle size={15} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="muted">
                        Action completed
                      </span>
                    )}
                  </td>
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <ClipboardList size={30} />
      <strong>{message}</strong>
      <span>
        Records will appear here once activity is
        available.
      </span>
    </div>
  );
}

function Loading() {
  return (
    <div className="loading-state">
      <div className="loader"></div>
      <span>Loading information...</span>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}

function fmtHours(value) {
  if (value === undefined || value === null) {
    return "0 hrs";
  }

  if (typeof value === "string") {
    return value.includes("hr")
      ? value
      : `${value} hrs`;
  }

  return `${Number(value).toFixed(2)} hrs`;
}

function capitalize(value) {
  if (!value) return "";

  return value.charAt(0).toUpperCase() +
    value.slice(1);
}

/* =========================================================
   ROOT
========================================================= */

function Root() {
  const [user, setUser] = useState(getUser());

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  function login(newUser) {
    setUser(newUser);
  }

  if (!user || !getToken()) {
    return <Auth onLogin={login} />;
  }

  return (
    <App
      user={user}
      onLogout={logout}
    />
  );
}

createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);