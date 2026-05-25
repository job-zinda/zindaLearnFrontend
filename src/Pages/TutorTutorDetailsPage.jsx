import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "../Components/Modal";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import "./TutorTutorDetailsPage.css";

function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function getName(value) {
  if (!value) return "";
  return typeof value === "object" ? value.name || value.title || "" : "";
}

function getCourseNames(tutor) {
  if (Array.isArray(tutor?.courseIds) && tutor.courseIds.length > 0) {
    const names = tutor.courseIds
      .map((course) => getName(course))
      .filter(Boolean);

    if (names.length > 0) return names.join(", ");
  }

  return getName(tutor?.courseId);
}

function formatSyllabus(value) {
  if (!value || value === "none") return "Not added";

  const text = String(value).trim();
  if (!text) return "Not added";

  if (text.toLowerCase() === "state") return "State";
  if (text.toLowerCase() === "cbse") return "CBSE";
  if (text.toLowerCase() === "icse") return "ICSE";

  return text;
}

function getStudentName(review) {
  return review?.studentId?.name || review?.studentName || "Student";
}

function getStudentPhoto(review) {
  const photo =
    review?.studentId?.photo ||
    review?.studentPhoto ||
    review?.photo ||
    "";

  const cleanPhoto = String(photo || "").trim();

  if (!cleanPhoto) return "";

  if (
    cleanPhoto === "null" ||
    cleanPhoto === "undefined" ||
    cleanPhoto === "false" ||
    cleanPhoto === "NaN"
  ) {
    return "";
  }

  return cleanPhoto;
}

function getReviewPhotoUrl(photo) {
  const cleanPhoto = String(photo || "").trim();

  if (!cleanPhoto) return "";

  return getMediaUrl(cleanPhoto);
}

function Stars({ rating = 0, compact = false }) {
  const fixedRating = Number(rating || 0);
  const rounded = Math.round(fixedRating);

  return (
    <div
      className={
        compact
          ? "tutor-detail-stars tutor-detail-stars--compact"
          : "tutor-detail-stars"
      }
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={
            n <= rounded ? "tutor-detail-star filled" : "tutor-detail-star"
          }
        >
          ★
        </span>
      ))}

      {!compact && <b>{fixedRating.toFixed(1)}</b>}
    </div>
  );
}

function ReviewCard({ review }) {
  const photo = getStudentPhoto(review);
  const photoUrl = getReviewPhotoUrl(photo);
  const name = getStudentName(review);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="tutor-detail-review-card">
      <div className="tutor-detail-review-card__left">
        <div className="tutor-detail-review-avatar">
          {photoUrl && !imageError ? (
            <img
              src={photoUrl}
              alt={name}
              onError={() => setImageError(true)}
            />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div>
          <h4>{name}</h4>
          <p>{review.review || "No review text added."}</p>
        </div>
      </div>

      <Stars rating={review.rating} compact />
    </div>
  );
}

export default function TutorTutorDetailsPage() {
  const { tuterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();

  const savedBackData = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("tutorTutorBackData") || "{}");
    } catch {
      return {};
    }
  })();

  const backTo =
    location.state?.backTo || savedBackData?.backTo || "/tutor/tutors";

  const backButtonLabel =
    location.state?.backButtonLabel ||
    savedBackData?.backButtonLabel ||
    "Tutors";

  const backLabel =
    location.state?.backLabel || savedBackData?.backLabel || "View details";

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allReviewsOpen, setAllReviewsOpen] = useState(false);

  const subjects = useMemo(() => {
    if (!tutor?.subjects) return [];

    return Array.isArray(tutor.subjects)
      ? tutor.subjects
      : String(tutor.subjects)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
  }, [tutor]);

  const recentReviews = useMemo(() => {
    return Array.isArray(tutor?.reviews) ? tutor.reviews.slice(0, 2) : [];
  }, [tutor]);

  async function fetchTutor() {
    try {
      setLoading(true);

      const { data } = await api.get(`/tuter/${tuterId}`);
      setTutor(data.tuter || null);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load tutor details"), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTutor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuterId]);

  if (loading) {
    return (
      <div className="tutor-detail-page">
        <div className="tutor-detail-state">Loading tutor details...</div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="tutor-detail-page">
        <div className="tutor-detail-state">Tutor not found</div>
      </div>
    );
  }

  const isOnlineTuition = tutor?.categoryId?.key === "online_tuition";

  return (
    <div className="tutor-detail-page">
      <div className="tutor-detail-breadcrumb">
        <button type="button" onClick={() => navigate(backTo)}>
          ← {backButtonLabel}
        </button>

        <span>»</span>

        <b>{backLabel}</b>
      </div>

      <div className="tutor-detail-card">
        <div className="tutor-detail-head">
          <div className="tutor-detail-avatar">
            {tutor.photo ? (
              <img src={getReviewPhotoUrl(tutor.photo)} alt={tutor.name} />
            ) : (
              <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
            )}
          </div>

          <div className="tutor-detail-title">
            <h2>{tutor.name || "Tutor"}</h2>
            <p>{tutor.qualification || "Qualification not added"}</p>
            <Stars rating={tutor.averageRating} />
          </div>
        </div>

        <div className="tutor-detail-info-grid">
          <div className="tutor-detail-info-box">
            <span>Qualification</span>
            <b>{tutor.qualification || "Not added"}</b>
          </div>

          <div className="tutor-detail-info-box">
            <span>Course / Class</span>
            <b>{getCourseNames(tutor) || "Not added"}</b>
          </div>

          {isOnlineTuition && (
            <div className="tutor-detail-info-box">
              <span>Syllabus</span>
              <b>{formatSyllabus(tutor.syllabus)}</b>
            </div>
          )}
        </div>

        <section className="tutor-detail-section">
          <h3>About</h3>
          <p>{tutor.about || "No description added."}</p>
        </section>

        <section className="tutor-detail-section">
          <h3>Subjects</h3>

          {subjects.length ? (
            <div className="tutor-detail-subject-pills">
              {subjects.map((subject) => (
                <span key={subject}>{subject}</span>
              ))}
            </div>
          ) : (
            <p>No subjects added.</p>
          )}
        </section>

        <section className="tutor-detail-section">
          <div className="tutor-detail-reviews-head">
            <h3>Recent Reviews</h3>

            {tutor.reviews?.length > 2 && (
              <button
                type="button"
                className="tutor-detail-show-more-btn"
                onClick={() => setAllReviewsOpen(true)}
              >
                Show more
              </button>
            )}
          </div>

          {recentReviews.length ? (
            <div className="tutor-detail-review-list">
              {recentReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="tutor-detail-empty-reviews">No reviews yet.</div>
          )}

          {tutor.reviews?.length > 0 && tutor.reviews?.length <= 2 && (
            <button
              type="button"
              className="tutor-detail-show-more-btn tutor-detail-show-more-btn--single"
              onClick={() => setAllReviewsOpen(true)}
            >
              Show more
            </button>
          )}
        </section>
      </div>

      <Modal
        open={allReviewsOpen}
        title="All Reviews"
        width="760px"
        onClose={() => setAllReviewsOpen(false)}
      >
        {tutor.reviews?.length ? (
          <div className="tutor-detail-all-reviews-list">
            {tutor.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <div className="tutor-detail-empty-reviews">No reviews yet.</div>
        )}
      </Modal>
    </div>
  );
}