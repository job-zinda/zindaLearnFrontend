import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import InlineAlert from "../Components/InlineAlert";

function getErrorMessage(err) {
  return (
    err?.response?.data?.msg ||
    err?.response?.data?.error ||
    "Something went wrong"
  );
}

function getStudent(feedback) {
  return feedback?.studentId || {};
}

function getPhotoSrc(photo) {
  if (!photo) return "";
  const src = String(photo).trim();

  if (
    src.startsWith("data:image") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  return src;
}

function Stars({ rating }) {
  const value = Math.round(Number(rating) || 0);

  return (
    <div className="admin-feedback-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= value ? "filled" : ""}>
          ★
        </span>
      ))}
    </div>
  );
}

function StudentAvatar({ student }) {
  const [error, setError] = useState(false);
  const photo = getPhotoSrc(student?.photo);
  const name = student?.name || "Student";

  return (
    <div className="admin-feedback-avatar">
      {photo && !error ? (
        <img src={photo} alt={name} onError={() => setError(true)} />
      ) : (
        <span>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

function FeedbackModal({ feedback, onClose }) {
  if (!feedback) return null;

  const student = getStudent(feedback);

  return createPortal(
    <div className="admin-feedback-modal-overlay" onMouseDown={onClose}>
      <div
        className="admin-feedback-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-feedback-modal-header">
          <h2>Review Details</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="admin-feedback-modal-body">
          <div className="admin-feedback-modal-user">
            <StudentAvatar student={student} />

            <div>
              <h3>{student?.name || "Student"}</h3>
              <p>{student?.email || "No email"}</p>
            </div>

            <Stars rating={feedback?.rating} />
          </div>

          <div className="admin-feedback-full-review">
            {feedback?.message || "No review added."}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function AdminFeedbackPage() {
  const { showAlert } = useAlert();

  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  async function fetchFeedbacks() {
    try {
      setLoading(true);
      const { data } = await api.get("/get/feedback/all");
      setFeedbacks(data?.feedbacks || []);
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredFeedbacks = useMemo(() => {
    const key = search.trim().toLowerCase();

    if (!key) return feedbacks;

    return feedbacks.filter((feedback) => {
      const student = getStudent(feedback);
      return String(student?.name || "").toLowerCase().includes(key);
    });
  }, [feedbacks, search]);

  return (
    <div className="admin-feedback-page">
      <InlineAlert />

      <div className="admin-feedback-toolbar">
        <div className="admin-feedback-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="admin-feedback-refresh-btn"
          onClick={fetchFeedbacks}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="admin-feedback-state">Loading reviews...</div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="admin-feedback-state">No reviews found</div>
      ) : (
        <div className="admin-feedback-grid">
          {filteredFeedbacks.map((feedback) => {
            const student = getStudent(feedback);
            const review = feedback?.message || "";
            const isLong = review.length > 150;

            return (
              <div className="admin-feedback-card" key={feedback?._id}>
                <div className="admin-feedback-card-top">
                  <div className="admin-feedback-student-info">
                    <StudentAvatar student={student} />
                    <h3>{student?.name || "Student"}</h3>
                  </div>

                  <Stars rating={feedback?.rating} />
                </div>

                <p className="admin-feedback-message">
                  {isLong ? `${review.slice(0, 150)}...` : review}
                </p>

                {isLong && (
                  <button
                    type="button"
                    className="admin-feedback-show-more"
                    onClick={() => setSelectedFeedback(feedback)}
                  >
                    Show more
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <FeedbackModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
      />
    </div>
  );
}