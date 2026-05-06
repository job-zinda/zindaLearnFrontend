


import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import "./AdminDashboardPage.css";

function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function formatGraphDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function buildLast30DaysGraph(apiGraphData = []) {
  const map = new Map();

  apiGraphData.forEach((item) => {
    const d = new Date(item.date);
    if (Number.isNaN(d.getTime())) return;

    const key = d.toISOString().slice(0, 10);
    map.set(key, Number(item.users || item.count || 0));
  });

  const result = [];

  for (let i = 29; i >= 0; i -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const key = date.toISOString().slice(0, 10);

    result.push({
      date: key,
      label: formatGraphDate(key),
      users: map.get(key) || 0,
    });
  }

  return result;
}

function StatCard({ title, value, change, changeType, onClick }) {
  return (
    <button
      type="button"
      className="admin-dashboard-stat-click"
      onClick={onClick}
    >
      <div className="admin-dashboard-stat-card">
        <p>{title}</p>

        <div className="admin-dashboard-stat-bottom">
          <h2>{value}</h2>

          {change ? (
            <span
              className={
                changeType === "down"
                  ? "admin-dashboard-change down"
                  : "admin-dashboard-change up"
              }
            >
              {change}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export default function AdminDashboardPage() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    newSignups: 0,
    totalStudents: 0,
    activeTutors: 0,
    graphData: [],
  });

  const [loading, setLoading] = useState(true);

  const chartData = useMemo(
    () => buildLast30DaysGraph(dashboard.graphData),
    [dashboard.graphData]
  );

  async function fetchDashboard() {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/dashboard");
      const payload = data?.data || data || {};

      setDashboard({
        newSignups: payload.newSignups || 0,
        totalStudents: payload.totalStudents || 0,
        activeTutors: payload.activeTutors || 0,
        graphData: payload.graphData || [],
      });
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load dashboard"), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-dashboard-page">
      {loading ? (
        <div className="admin-dashboard-loading">Loading dashboard...</div>
      ) : (
        <>
          <section className="admin-dashboard-stats">
            <StatCard
              title="New Signups (24 h)"
              value={dashboard.newSignups}
              change="+11%"
              changeType="up"
              onClick={() => navigate("/admin/students?filter=new")}
            />

            <StatCard
              title="Total Students"
              value={dashboard.totalStudents}
              change="-3%"
              changeType="down"
              onClick={() => navigate("/admin/students")}
            />

            <StatCard
              title="Active Tutors"
              value={dashboard.activeTutors}
              change="+19%"
              changeType="up"
              onClick={() => navigate("/admin/tutors")}
            />
          </section>

          <div className="admin-dashboard-divider" />

          <section className="admin-dashboard-chart-section">
            <div className="admin-dashboard-chart-card">
              <div className="admin-dashboard-chart-title">
                <h3>User Activity</h3>
                <p>Last 30 days registrations</p>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="dashboardUsers"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b3dff" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#8b3dff" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="4 4" stroke="#334155" />

                  <XAxis
                    dataKey="label"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />

                  <Tooltip
                    formatter={(value) => [`${value} registrations`, "Users"]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      background: "#111827",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      color: "#ffffff",
                    }}
                    labelStyle={{ color: "#ffffff" }}
                  />

                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#c4b5fd"
                    strokeWidth={3}
                    fill="url(#dashboardUsers)"
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  );
}