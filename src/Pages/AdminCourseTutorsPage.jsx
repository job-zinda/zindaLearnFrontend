



import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "../Components/Modal";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import api from "../api/axios";
import "./AdminTutorsPage.css";
import "./AdminTutorDetailsPage.css";

function normalizeId(value) {
  if (!value) return "";
  return typeof value === "object" ? value._id : value;
}

function isTutorActive(tutor) {
  return tutor?.isActive === true || tutor?.isActive === "true" || tutor?.isActive === 1;
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
}

function Stars({ rating = 0 }) {
  const fixedRating = Number(rating || 0);
  const rounded = Math.round(fixedRating);

  return (
    <div className="tutor-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? "star filled" : "star"}>
          ★
        </span>
      ))}
      <b>{fixedRating.toFixed(1)}</b>
    </div>
  );
}

export default function AdminCourseTutorsPage() {
  const { categoryId, courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();

  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const courseName = location.state?.courseName || "Selected Course";
  const backTo = location.state?.backTo || `/admin/courses/${categoryId}`;

  async function fetchTutors() {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/tuter/all");
      const allTutors = data.tuters || [];

      // const filtered = allTutors.filter((tutor) => {
      //   return String(normalizeId(tutor.courseId)) === String(courseId);
      // });



      const filtered = allTutors.filter((tutor) => {
  // NEW MULTIPLE COURSE SUPPORT
  if (Array.isArray(tutor.courseIds) && tutor.courseIds.length > 0) {
    return tutor.courseIds.some(
      (course) => String(normalizeId(course)) === String(courseId)
    );
  }

  // OLD SINGLE COURSE SUPPORT
  return String(normalizeId(tutor.courseId)) === String(courseId);
});

      setTutors(filtered);
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTutors();
  }, [courseId]);

  const filteredTutors = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tutors;

    return tutors.filter((tutor) =>
      String(tutor.name || "").toLowerCase().includes(q)
    );
  }, [tutors, search]);

  function askDeleteTutor(tutor) {
    setDeleteTarget(tutor);
    setConfirmOpen(true);
    setMenuOpenId(null);
  }

  async function confirmDeleteTutor() {
    if (!deleteTarget) return;

    try {
      await api.delete(`/admin/tuter/delete/${deleteTarget._id}`);

      showAlert("Tutor deleted successfully", "success");
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchTutors();
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    }
  }

  async function toggleStatus(tutor) {
    try {
      const currentActive = isTutorActive(tutor);

      await api.patch(`/admin/tuter/status/${tutor._id}`, {
        isActive: !currentActive,
      });

      showAlert(
        currentActive
          ? "Tutor deactivated successfully"
          : "Tutor activated successfully",
        "success"
      );

      setMenuOpenId(null);
      fetchTutors();
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    }
  }

  function goToDetails(tutor, openEdit = false) {
    navigate(`/admin/tutors/${tutor._id}`, {
      state: {
        backTo: `/admin/courses/${categoryId}/tutors/${courseId}`,
        courseName,
        openEdit,
      },
    });
  }

  return (
    <div className="tutor-page" onClick={() => setMenuOpenId(null)}>
      <div className="detail-breadcrumb">
        <button type="button" onClick={() => navigate(backTo)}>
          ← Tutors
        </button>
        <span>»</span>
        <b>{courseName}</b>
      </div>

      <div className="tutor-toolbar" onClick={(e) => e.stopPropagation()}>
        <div className="tutor-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutors..."
          />
        </div>
      </div>

      {loading ? (
        <div className="tutor-state">Loading tutors...</div>
      ) : filteredTutors.length === 0 ? (
        <div className="tutor-state">No tutors found in this course</div>
      ) : (
        <div className="tutor-grid">
          {filteredTutors.map((tutor) => {
            const active = isTutorActive(tutor);

            return (
              <article
                key={tutor._id}
                className={`tutor-card ${!active ? "tutor-card--inactive" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                {!active && <span className="inactive-badge">Inactive</span>}

                <div className="tutor-menu-wrap">
                  <button
                    className="tutor-menu-btn"
                    type="button"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === tutor._id ? null : tutor._id)
                    }
                  >
                    ⋮
                  </button>

                  {menuOpenId === tutor._id && (
                    <div className="tutor-menu">
                      <button onClick={() => goToDetails(tutor)}>👁 View</button>
                      <button onClick={() => goToDetails(tutor, true)}>✎ Edit</button>
                      <button onClick={() => askDeleteTutor(tutor)}>🗑 Delete</button>
                      <button onClick={() => toggleStatus(tutor)}>
                        {active ? "⏻ Deactive" : "✓ Active"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="tutor-card-top">
                  <div className="tutor-avatar">
                    {tutor.photo ? (
                      <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
                    ) : (
                      <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
                    )}
                  </div>

                  <div>
                    <h3>{tutor.name}</h3>
                    <p>{tutor.qualification || "Qualification not added"}</p>
                  </div>
                </div>

                <p className="tutor-about">
                  {tutor.about || "No description added"}
                </p>

                <Stars rating={tutor.averageRating} />

                <button
                  className="view-details-btn"
                  onClick={() => goToDetails(tutor)}
                >
                  View Details
                </button>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={confirmOpen}
        title="Delete Tutor"
        width="430px"
        onClose={() => setConfirmOpen(false)}
      >
        <div className="delete-confirm-box">
          <p>
            <b>{deleteTarget?.name}</b> Do you want to delete this tutor?
          </p>

          <div className="form-actions">
            <button className="secondary-btn" onClick={() => setConfirmOpen(false)}>
              Cancel
            </button>
            <button className="danger-btn" onClick={confirmDeleteTutor}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}