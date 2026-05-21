

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerSection from "../Components/BannerSection";
import CategorySection from "../Components/CategorySection";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import "./AdminHome.css";

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
    <div className="home-feedback-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= value ? "filled" : ""}>
          ★
        </span>
      ))}
    </div>
  );
}

function StudentAvatar({ student }) {
  const [imgError, setImgError] = useState(false);
  const name = student?.name || "Student";
  const photo = getPhotoSrc(student?.photo);

  return (
    <div className="home-feedback-avatar">
      {photo && !imgError ? (
        <img src={photo} alt={name} onError={() => setImgError(true)} />
      ) : (
        <span>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

function StudentFeedbackPreview() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);

  async function fetchFeedbacks() {
    try {
      setLoading(true);
      const { data } = await api.get("/get/feedback/all");
      setFeedbacks(data?.feedbacks || []);
    } catch (err) {
      showAlert(
        err?.response?.data?.msg ||
          err?.response?.data?.error ||
          "Failed to fetch student reviews",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const feedbackGroups = useMemo(() => {
    const groups = [];

    for (let i = 0; i < feedbacks.length; i += 3) {
      groups.push(feedbacks.slice(i, i + 3));
    }

    return groups;
  }, [feedbacks]);

  useEffect(() => {
    if (feedbackGroups.length <= 1) return;

    const timer = setInterval(() => {
      setPageIndex((prev) => (prev + 1) % feedbackGroups.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [feedbackGroups.length]);

  const visibleFeedbacks = feedbackGroups[pageIndex] || [];

  return (
    <section className="admin-section home-feedback-section">
      <div className="home-feedback-header">
        <h2>What Students Say</h2>

        <button
          type="button"
          className="home-feedback-view-all"
          onClick={() => navigate("/admin/reviews")}
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="state-card">Loading student feedbacks...</div>
      ) : feedbacks.length === 0 ? (
        <div className="state-card">No student feedbacks found.</div>
      ) : (
        <>
          <div className="home-feedback-slider">
            <div key={pageIndex} className="home-feedback-row">
              {visibleFeedbacks.map((feedback) => {
                const student = getStudent(feedback);
                const message = feedback?.message || "No review added.";

                return (
                  <div className="home-feedback-card" key={feedback?._id}>
                    <div className="home-feedback-card-top">
                      <div className="home-feedback-user">
                        <StudentAvatar student={student} />

                        <div>
                          <h3>{student?.name || "Student"}</h3>
                        </div>
                      </div>

                      <Stars rating={feedback?.rating} />
                    </div>

                    <p className="home-feedback-message">
                      {message.length > 130
                        ? `${message.slice(0, 130)}...`
                        : message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {feedbackGroups.length > 1 && (
            <div className="home-feedback-dots">
              {feedbackGroups.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    pageIndex === index ? "home-feedback-dot active" : "home-feedback-dot"
                  }
                  onClick={() => setPageIndex(index)}
                  aria-label={`Show feedback group ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function AdminHome() {
  return (
    <div className="admin-home-page">
      <div className="page-stack">
        <div className="banner-section">
          <BannerSection />
        </div>

        <div className="category-section">
          <CategorySection />
        </div>

        <StudentFeedbackPreview />
      </div>
    </div>
  );
}