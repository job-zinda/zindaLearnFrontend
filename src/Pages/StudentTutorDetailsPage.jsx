
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../Components/Modal";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import phoneIcon from "../assets/contact icon.png";
import whatsappIcon from "../assets/watsapp icon.png";
import "./StudentTutorDetailsPage.css";

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

function formatSyllabus(value) {
  if (value === "state") return "State";
  if (value === "cbse") return "CBSE";
  if (value === "icse") return "ICSE";
  return "Not added";
}

function getStudentName(review) {
  return review?.studentId?.name || review?.studentName || "Student";
}

function getStudentPhoto(review) {
  return review?.studentId?.photo || review?.studentPhoto || review?.photo || "";
}

function getReviewPhotoUrl(photo) {
  if (!photo) return "";

  const cleanPhoto = String(photo).trim();

  if (
    cleanPhoto.startsWith("data:image") ||
    cleanPhoto.startsWith("blob:") ||
    cleanPhoto.startsWith("http://") ||
    cleanPhoto.startsWith("https://")
  ) {
    return cleanPhoto;
  }

  return getMediaUrl(cleanPhoto);
}

function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user?._id || user?.id || "";
}

function Stars({ rating = 0, compact = false }) {
  const fixedRating = Number(rating || 0);
  const rounded = Math.round(fixedRating);

  return (
    <div
      className={
        compact
          ? "student-detail-stars student-detail-stars--compact"
          : "student-detail-stars"
      }
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={
            n <= rounded ? "student-detail-star filled" : "student-detail-star"
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
    <div className="student-review-card">
      <div className="student-review-card__left">
        <div className="student-review-avatar">
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

export default function StudentTutorDetailsPage() {
  const { tuterId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [allReviewsOpen, setAllReviewsOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

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

  const myReview = useMemo(() => {
    const userId = getCurrentUserId();
    if (!userId || !Array.isArray(tutor?.reviews)) return null;

    return tutor.reviews.find((review) => {
      const studentId =
        typeof review.studentId === "object"
          ? review.studentId?._id
          : review.studentId;

      return String(studentId) === String(userId);
    });
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

  function openReviewModal() {
    setRating(myReview?.rating || 0);
    setReviewText(myReview?.review || "");
    setReviewOpen(true);
  }

  async function submitReview(e) {
    e.preventDefault();

    try {
      if (!rating) return showAlert("Please select rating", "error");
      if (!reviewText.trim()) return showAlert("Please write your review", "error");

      setSubmitting(true);

      await api.post(`/tuter/${tuterId}/review`, {
        rating,
        review: reviewText.trim(),
      });

      showAlert("Review saved successfully", "success");
      setReviewOpen(false);
      fetchTutor();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to save review"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteMyReview() {
    try {
      setSubmitting(true);

      await api.delete(`/tuter/${tuterId}/review`);

      showAlert("Review deleted successfully", "success");
      setReviewOpen(false);
      setRating(0);
      setReviewText("");
      fetchTutor();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to delete review"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function sendConnectRequest() {
    try {
      setSubmitting(true);

      const { data } = await api.post(`/chat/connect-request/${tuterId}`);

      showAlert("Connect request sent to admin", "success");

      const roomId = data?.room?._id || data?.chatRoom?._id || data?.roomId;

      if (roomId) {
        navigate(`/student/chats?roomId=${roomId}`);
      } else {
        navigate("/student/chats");
      }
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to send connect request"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="student-detail-page">
        <div className="student-detail-state">Loading tutor details...</div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="student-detail-page">
        <div className="student-detail-state">Tutor not found</div>
      </div>
    );
  }

  const isOnlineTuition = tutor?.categoryId?.key === "online_tuition";

  return (
    <div className="student-detail-page">
      <div className="student-detail-breadcrumb">
        <button type="button" onClick={() => navigate("/student/tutors")}>
          ← Tutors
        </button>
        <span>»</span>
        <b>View details</b>
      </div>

      <div className="student-detail-card">
        <div className="student-detail-head">
          <div className="student-detail-avatar">
            {tutor.photo ? (
              <img src={getReviewPhotoUrl(tutor.photo)} alt={tutor.name} />
            ) : (
              <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
            )}
          </div>

          <div className="student-detail-title">
            <h2>{tutor.name}</h2>
            <p>{tutor.qualification || "Qualification not added"}</p>
            <Stars rating={tutor.averageRating} />
          </div>
        </div>

        <div className="student-detail-info-grid">
          <div className="student-detail-info-box">
            <span>Qualification</span>
            <b>{tutor.qualification || "Not added"}</b>
          </div>

          <div className="student-detail-info-box">
            <span>Course / Class</span>
            <b>{getName(tutor.courseId) || "Not added"}</b>
          </div>

          {isOnlineTuition && (
            <div className="student-detail-info-box">
              <span>Syllabus</span>
              <b>{formatSyllabus(tutor.syllabus)}</b>
            </div>
          )}
        </div>

        <section className="student-detail-section">
          <h3>About</h3>
          <p>{tutor.about || "No description added."}</p>
        </section>

        <section className="student-detail-section">
          <h3>Subjects</h3>

          {subjects.length ? (
            <div className="student-subject-pills">
              {subjects.map((subject) => (
                <span key={subject}>{subject}</span>
              ))}
            </div>
          ) : (
            <p>No subjects added.</p>
          )}
        </section>

        <section className="student-detail-section">
          <div className="student-reviews-head">
            <h3>Recent Reviews</h3>

            {tutor.reviews?.length > 2 && (
              <button
                type="button"
                className="student-show-more-btn"
                onClick={() => setAllReviewsOpen(true)}
              >
                Show more
              </button>
            )}
          </div>

          {recentReviews.length ? (
            <div className="student-review-list">
              {recentReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="student-empty-reviews">No reviews yet.</div>
          )}

          {tutor.reviews?.length > 0 && tutor.reviews?.length <= 2 && (
            <button
              type="button"
              className="student-show-more-btn student-show-more-btn--single"
              onClick={() => setAllReviewsOpen(true)}
            >
              Show more
            </button>
          )}
        </section>

        <div className="student-detail-bottom-actions">
          <button
            type="button"
            className="student-write-review-btn"
            onClick={openReviewModal}
          >
            Write Review
          </button>

          <button
            type="button"
            className="student-connect-btn"
            disabled={submitting}
            onClick={sendConnectRequest}
          >
            {submitting ? "Sending..." : "Send Request"}
          </button>
        </div>

        <button
          type="button"
          className="student-connect-full-btn"
          onClick={() => setConnectModalOpen(true)}
        >
          Contact
        </button>
      </div>

      <Modal
        open={allReviewsOpen}
        title="All Reviews"
        width="760px"
        onClose={() => setAllReviewsOpen(false)}
      >
        {tutor.reviews?.length ? (
          <div className="student-all-reviews-list">
            {tutor.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <div className="student-empty-reviews">No reviews yet.</div>
        )}
      </Modal>

      <Modal
        open={reviewOpen}
        title={myReview ? "Update Review" : "Write Review"}
        width="560px"
        onClose={() => setReviewOpen(false)}
      >
        <form className="student-review-form" onSubmit={submitReview}>
          <div className="student-rating-picker">
            <span>Rating</span>

            <div className="student-rating-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n <= rating ? "selected" : ""}
                  onClick={() => setRating(n)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <label className="student-review-field">
            <span>Review</span>
            <textarea
              rows="5"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
            />
          </label>

          <div className="student-review-actions">
            {myReview && (
              <button
                type="button"
                className="student-review-delete-btn"
                onClick={deleteMyReview}
                disabled={submitting}
              >
                Delete
              </button>
            )}

            <button
              type="button"
              className="student-review-cancel-btn"
              onClick={() => setReviewOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="student-review-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Saving..." : myReview ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={connectModalOpen}
        title="Connect"
        width="420px"
        onClose={() => setConnectModalOpen(false)}
      >
        <div className="connect-modal-box">
          <button
            type="button"
            className="connect-icon-btn"
            onClick={() => {
              window.location.href = "tel:8921923281";
            }}
          >
            <img src={phoneIcon} alt="phone" />
            <span>Call</span>
          </button>

          <button
            type="button"
            className="connect-icon-btn"
            onClick={() => {
              window.open(" https://wa.me/message/XTRJLU7IXTBHI1 ", "_blank");
            }}
          >
            <img src={whatsappIcon} alt="whatsapp" />
            <span>WhatsApp</span>
          </button>
        </div>
      </Modal>
    </div>
  );
}