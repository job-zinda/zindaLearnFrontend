
import { FiEye, FiTrash2 } from "react-icons/fi";

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  // Area,
  // AreaChart,
  // CartesianGrid,
  // ResponsiveContainer,
  // Tooltip,
  // XAxis,
  // YAxis,



Area,
AreaChart,
CartesianGrid,
Cell,
Pie,
PieChart,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,



} from "recharts";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import "./AdminDashboardPage.css";






import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
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




// function getImageSrc(value) {
//   if (!value) return "";
//   const src = String(value).trim();

//   if (
//     src.startsWith("data:image") ||
//     src.startsWith("blob:") ||
//     src.startsWith("http://") ||
//     src.startsWith("https://")
//   ) {
//     return src;
//   }

//   return getMediaUrl(src);
// }

// function formatAssignedDate(value) {
//   if (!value) return "Not added";
//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return "Not added";

//   return date.toLocaleString("en-US", {
//     month: "short",
//     day: "2-digit",
//     year: "numeric",
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
// }

// async function fetchAssignmentTable() {
//   try {
//     setAssignmentLoading(true);
//     const { data } = await api.get("/admin/dashboard/assignment-table");
//     setAssignmentRows(data?.rows || []);
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to load assignment table"), "error");
//   } finally {
//     setAssignmentLoading(false);
//   }
// }

// async function removeAssignedTutor() {
//   if (!removeTarget) return;

//   try {
//     setRemoving(true);

//     await api.delete(
//       `/admin/student/${removeTarget.student._id}/assigned-tutor/${removeTarget.tutor._id}`
//     );

//     showAlert("Assigned tutor removed successfully", "success");
//     setRemoveOpen(false);
//     setRemoveTarget(null);
//     fetchAssignmentTable();
//     fetchDashboard();
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to remove assigned tutor"), "error");
//   } finally {
//     setRemoving(false);
//   }
// }





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

  // const [dashboard, setDashboard] = useState({
  //   newSignups: 0,
  //   totalStudents: 0,
  //   activeTutors: 0,
  //   graphData: [],
  // });




// const [dashboard, setDashboard] = useState({
//   newSignups: 0,
//   activeStudents: 0,
//   activeTutors: 0,
//   deactiveTutors: 0,
//   assignedTutors: 0,
//   graphData: [],
// });







const [dashboard, setDashboard] = useState({
  newSignups: 0,
  activeStudents: 0,
  activeTutors: 0,
  deactiveTutors: 0,
  assignedTutors: 0,
  assignedStudents: 0,
  graphData: [],
});



const [assignmentRows, setAssignmentRows] = useState([]);
const [assignmentLoading, setAssignmentLoading] = useState(false);
const [removeOpen, setRemoveOpen] = useState(false);
const [removeTarget, setRemoveTarget] = useState(null);
const [removing, setRemoving] = useState(false);


  const [loading, setLoading] = useState(true);

  const chartData = useMemo(
    () => buildLast30DaysGraph(dashboard.graphData),
    [dashboard.graphData]
  );




const assignmentPieData = useMemo(() => {
  return [
    {
      name: "Assigned Tutors",
      value: Number(dashboard.assignedTutors || 0),
    },
    {
      name: "Assigned Students",
      value: Number(dashboard.assignedStudents || 0),
    },
  ];
}, [dashboard.assignedTutors, dashboard.assignedStudents]);

const assignmentColors = ["#a855f7", "#ec4899"];





  async function fetchDashboard() {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/dashboard");
      const payload = data?.data || data || {};

      // setDashboard({
      //   newSignups: payload.newSignups || 0,
      //   totalStudents: payload.totalStudents || 0,
      //   activeTutors: payload.activeTutors || 0,
      //   graphData: payload.graphData || [],
      // });




// setDashboard({
//   newSignups: payload.newSignups || 0,
//   activeStudents: payload.activeStudents || 0,
//   activeTutors: payload.activeTutors || 0,
//   deactiveTutors: payload.deactiveTutors || 0,
//   assignedTutors: payload.assignedTutors || 0,
//   graphData: payload.graphData || [],
// });







setDashboard({
  newSignups: payload.newSignups || 0,
  activeStudents: payload.activeStudents || 0,
  activeTutors: payload.activeTutors || 0,
  deactiveTutors: payload.deactiveTutors || 0,
  assignedTutors: payload.assignedTutors || 0,
  assignedStudents: payload.assignedStudents || 0,
  graphData: payload.graphData || [],
});






    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load dashboard"), "error");
    } finally {
      setLoading(false);
    }
  }





function getImageSrc(value) {
  if (!value) return "";

  const src = String(value).trim();

  if (
    src.startsWith("data:image") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  return getMediaUrl(src);
}

function formatAssignedDate(value) {
  if (!value) return "Not added";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not added";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

async function fetchAssignmentTable() {
  try {
    setAssignmentLoading(true);

    const { data } = await api.get("/admin/dashboard/assignment-table");

    console.log("ASSIGNMENT TABLE RESPONSE:", data);

    setAssignmentRows(data?.rows || []);
  } catch (err) {
    console.log("ASSIGNMENT TABLE ERROR:", err?.response?.data || err);
    showAlert(getErrorMessage(err, "Failed to load assignment table"), "error");
  } finally {
    setAssignmentLoading(false);
  }
}

async function removeAssignedTutor() {
  if (!removeTarget) return;

  try {
    setRemoving(true);

    await api.delete(
      `/admin/student/${removeTarget.student._id}/assigned-tutor/${removeTarget.tutor._id}`
    );

    showAlert("Assigned tutor removed successfully", "success");

    setRemoveOpen(false);
    setRemoveTarget(null);

    await fetchAssignmentTable();
    await fetchDashboard();
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to remove assigned tutor"), "error");
  } finally {
    setRemoving(false);
  }
}







  // useEffect(() => {
  //   fetchDashboard();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);




useEffect(() => {
  fetchDashboard();
  fetchAssignmentTable();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);




  return (
    <div className="admin-dashboard-page">
      {loading ? (
        <div className="admin-dashboard-loading">Loading dashboard...</div>
      ) : (
        <>
          <section className="admin-dashboard-stats">
            {/* <StatCard
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
            /> */}




{/* 
<StatCard
  title="New Signups (24 h)"
  value={dashboard.newSignups}
  change="+11%"
  changeType="up"
  onClick={() => navigate("/admin/students?filter=new")}
/>

<StatCard
  title="Active Students"
  value={dashboard.activeStudents}
  change="+"
  changeType="up"
  onClick={() => navigate("/admin/students?filter=active")}
/>

<StatCard
  title="Active Tutors"
  value={dashboard.activeTutors}
  change="+19%"
  changeType="up"
  onClick={() => navigate("/admin/tutors?filter=active")}
/>

<StatCard
  title="Deactive Tutors"
  value={dashboard.deactiveTutors}
  change="-"
  changeType="down"
  onClick={() => navigate("/admin/tutors?filter=deactive")}
/>

<StatCard
  title="Assigned Tutors"
  value={dashboard.assignedTutors}
  change="+"
  changeType="up"
  onClick={() => navigate("/admin/students")}
/> */}





<StatCard
  title="New Signups (24 h)"
  value={dashboard.newSignups}
  onClick={() => navigate("/admin/students?filter=new")}
/>

{/* <StatCard
  title="Active Students"
  value={dashboard.activeStudents}
  onClick={() => navigate("/admin/students?filter=active")}
/>

<StatCard
  title="Active Tutors"
  value={dashboard.activeTutors}
  onClick={() => navigate("/admin/tutors?filter=active")}
/>

<StatCard
  title="Deactive Tutors"
  value={dashboard.deactiveTutors}
  onClick={() => navigate("/admin/tutors?filter=deactive")}
/> */}



<StatCard
  title="Active Students"
  value={dashboard.activeStudents}
  onClick={() => navigate("/admin/students?filter=active")}
/>

<StatCard
  title="Active Tutors"
  value={dashboard.activeTutors}
  onClick={() => navigate("/admin/tutors?filter=active")}
/>

<StatCard
  title="Deactive Tutors"
  value={dashboard.deactiveTutors}
  onClick={() => navigate("/admin/tutors?filter=deactive")}
/>





<StatCard
  title="Assigned Tutors"
  value={dashboard.assignedTutors}
/>











          </section>

          <div className="admin-dashboard-divider" />

          {/* <section className="admin-dashboard-chart-section">
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
          </section> */}




<section className="admin-dashboard-chart-section">
  <div className="admin-dashboard-chart-card">
    <div className="admin-dashboard-chart-title">
      <h3>User Activity</h3>
      <p>Last 30 days registrations</p>
    </div>

    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="dashboardUsers" x1="0" y1="0" x2="0" y2="1">
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

        <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} allowDecimals={false} />

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

  <div className="admin-dashboard-chart-card admin-dashboard-pie-card">
    <div className="admin-dashboard-chart-title">
      <h3>Assignment Ratio</h3>
      <p>Assigned tutors : assigned students</p>
    </div>

    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Tooltip
          formatter={(value, name) => [`${value}`, name]}
          contentStyle={{
            background: "#111827",
            border: "1px solid #334155",
            borderRadius: "12px",
            color: "#ffffff",
          }}
          labelStyle={{ color: "#ffffff" }}
        />

        <Pie
          data={assignmentPieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={92}
          innerRadius={48}
          paddingAngle={4}
          label={({ name, value }) => `${name}: ${value}`}
        >
          {assignmentPieData.map((entry, index) => (
            <Cell key={entry.name} fill={assignmentColors[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    <div className="admin-dashboard-ratio-text">
      {dashboard.assignedTutors} : {dashboard.assignedStudents}
    </div>
  </div>
</section>









<section className="admin-assignment-table-card">
  <div className="admin-assignment-table-head">
    <div>
      <h3>Tutor Assignment Table</h3>
      <p>Students, assigned tutors, assigned date and last 30 days interaction</p>
    </div>
  </div>

  {assignmentLoading ? (
    <div className="admin-assignment-empty">Loading assignments...</div>
  ) : assignmentRows.length === 0 ? (
    <div className="admin-assignment-empty">No tutor assignments found</div>
  ) : (
    <div className="admin-assignment-table-scroll">
      <table className="admin-assignment-table">
        <thead>
          <tr>
            <th>Students</th>
            <th>Assigned Tutors</th>
            <th>Assigned Date</th>
            <th>Student - Tutor Interaction</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {assignmentRows.map((row) =>
            row.tutors.map((tutor, index) => {
              const studentPhoto = getImageSrc(row.student?.photo);
              const tutorPhoto = getImageSrc(tutor?.photo);

              return (
                <tr key={`${row.student._id}-${tutor._id}`}>
                  {index === 0 && (
                    <td rowSpan={row.tutors.length}>
                      <div className="admin-assignment-profile">
                        <div className="admin-assignment-avatar">
                          {studentPhoto ? (
                            <img src={studentPhoto} alt={row.student.name} />
                          ) : (
                            <span>
                              {row.student?.name?.charAt(0)?.toUpperCase() || "S"}
                            </span>
                          )}
                        </div>

                        <div>
                          <h4>{row.student?.name || "Student"}</h4>
                          <p>{row.student?.email || "No email"}</p>
                          <small>{row.student?.phone || "No phone"}</small>
                        </div>
                      </div>
                    </td>
                  )}

                  <td>
                    <div className="admin-assignment-profile admin-assignment-tutor-profile">
                      <div className="admin-assignment-avatar">
                        {tutorPhoto ? (
                          <img src={tutorPhoto} alt={tutor.name} />
                        ) : (
                          <span>{tutor?.name?.charAt(0)?.toUpperCase() || "T"}</span>
                        )}
                      </div>

                      <div>
                        <h4>{tutor?.name || "Tutor"}</h4>
                        <p>{tutor?.qualification || "Qualification not added"}</p>
                        <small>{tutor?.email || tutor?.phone || "No contact"}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="admin-assignment-date">
                      {formatAssignedDate(tutor.assignedAt)}
                    </div>
                  </td>

                  <td>
                    <div className="admin-assignment-sparkline">
                      <ResponsiveContainer width="100%" height={58}>
                        <AreaChart data={tutor.interaction || []}>
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#22c55e"
                            fill="rgba(34,197,94,0.18)"
                            strokeWidth={2}
                            dot={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </td>

                  <td>
                    <div className="admin-assignment-actions">
                      <button
                        type="button"
                        title="View tutor details"
                        onClick={() => navigate(`/admin/tutors/${tutor._id}`)}
                      >
                        <FiEye />
                      </button>

                      <button
                        type="button"
                        className="remove"
                        title="Remove assigned tutor"
                        onClick={() => {
                          setRemoveTarget({
                            student: row.student,
                            tutor,
                          });
                          setRemoveOpen(true);
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  )}
</section>

{removeOpen && (
  <div className="admin-dashboard-remove-overlay">
    <div className="admin-dashboard-remove-modal">
      <div className="admin-dashboard-remove-header">
        <h2>Remove Assigned Tutor</h2>
        <button
          type="button"
          onClick={() => {
            if (removing) return;
            setRemoveOpen(false);
            setRemoveTarget(null);
          }}
        >
          ×
        </button>
      </div>

      <div className="admin-dashboard-remove-body">
        <p>
          Do you want to remove{" "}
          <b>{removeTarget?.tutor?.name || "this tutor"}</b> from this student?
        </p>

        <div className="admin-dashboard-remove-actions">
          <button
            type="button"
            className="cancel"
            disabled={removing}
            onClick={() => {
              setRemoveOpen(false);
              setRemoveTarget(null);
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            className="remove"
            disabled={removing}
            onClick={removeAssignedTutor}
          >
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}


        </>
      )}
    </div>
  );
}