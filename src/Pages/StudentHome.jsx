

import React, { useEffect, useMemo, useState } from "react";
import StudentBannerSection from "../Components/StudentBannerSection";
import StudentCategorySection from "../Components/StudentCategorySection";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import "./StudentHome.css";



import { getMediaUrl } from "../utils/media";






function getStudent(feedback) {
  return feedback?.studentId || {};
}








function getPhotoSrc(photo) {
  if (!photo) return "";

  const src = String(photo || "").trim();

  if (
    !src ||
    src === "null" ||
    src === "undefined" ||
    src === "false" ||
    src === "NaN"
  ) {
    return "";
  }

  return getMediaUrl(src);
}







function Stars({ rating }) {
  const value = Math.round(Number(rating) || 0);

  return (
    <div className="student-home-feedback-stars">
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
    <div className="student-home-feedback-avatar">
      {photo && !imgError ? (
        <img src={photo} alt={name} onError={() => setImgError(true)} />
      ) : (
        <span>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

function StudentFeedbackPreview() {
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
    <section className="student-home-feedback-section">
      <div className="student-home-feedback-header">
        <h2>What Students Say</h2>
      </div>

      {loading ? (
        <div className="student-home-feedback-state">
          Loading student feedbacks...
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="student-home-feedback-state">
          No student feedbacks found.
        </div>
      ) : (
        <>
          <div className="student-home-feedback-slider">
            <div key={pageIndex} className="student-home-feedback-row">
              {visibleFeedbacks.map((feedback) => {
                const student = getStudent(feedback);
                const message = feedback?.message || "No review added.";

                return (
                  <div
                    className="student-home-feedback-card"
                    key={feedback?._id}
                  >
                    <div className="student-home-feedback-card-top">
                      <div className="student-home-feedback-user">
                        <StudentAvatar student={student} />

                        <div>
                          <h3>{student?.name || "Student"}</h3>
                        </div>
                      </div>

                      <Stars rating={feedback?.rating} />
                    </div>

                    <p className="student-home-feedback-message">
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
            <div className="student-home-feedback-dots">
              {feedbackGroups.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    pageIndex === index
                      ? "student-home-feedback-dot active"
                      : "student-home-feedback-dot"
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

export default function StudentHome() {
  return (
    <div className="student-home-page">
      <div className="student-home-stack">
        <StudentBannerSection />
        <StudentCategorySection />
        <StudentFeedbackPreview />
      </div>
    </div>
  );
}