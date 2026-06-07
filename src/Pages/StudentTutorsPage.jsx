

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import "./StudentTutorsPage.css";

function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function Stars({ rating = 0 }) {
  const fixedRating = Number(rating || 0);
  const rounded = Math.round(fixedRating);

  return (
    <div className="student-tutor-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= rounded ? "student-star filled" : "student-star"}
        >
          ★
        </span>
      ))}
      <b>{fixedRating.toFixed(1)}</b>
    </div>
  );
}

function getSubjects(tutor) {
  if (Array.isArray(tutor.subjects)) return tutor.subjects.join(", ");
  return tutor.subjects || "Subject not added";
}

export default function StudentTutorsPage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredTutors = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tutors;

    return tutors.filter((tutor) => {
      return (
        String(tutor.name || "").toLowerCase().includes(q) ||
        String(getSubjects(tutor)).toLowerCase().includes(q) ||
        String(tutor.qualification || "").toLowerCase().includes(q)
      );
    });
  }, [tutors, search]);

  async function fetchTutors() {
    try {
      setLoading(true);
      const { data } = await api.get("/tuter/all");
      setTutors(data.tuters || []);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTutors();
  }, []);

  return (
    <div className="student-tutors-page">
      <div className="student-tutor-toolbar">
        <div className="student-tutor-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutors..."
          />
        </div>
      </div>

      {loading ? (
        <div className="student-tutor-state">Loading tutors...</div>
      ) : filteredTutors.length === 0 ? (
        <div className="student-tutor-state">No tutors found</div>
      ) : (
        <div className="student-tutor-grid">
          {filteredTutors.map((tutor) => (
            <article className="student-tutor-card" key={tutor._id}>
              <div className="student-tutor-card-top">
                <div className="student-tutor-avatar">
                  {tutor.photo ? (
                    <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
                  ) : (
                    <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
                  )}
                </div>

                <div className="student-tutor-info">
                  <h3>{tutor.name || "Tutor"}</h3>
                  <p>{tutor.qualification || "Qualification not added"}</p>
                </div>
              </div>

              <p className="student-tutor-about">
                {tutor.about || "No description added"}
              </p>

              <Stars rating={tutor.averageRating} />
















              <button
                type="button"
                className="student-view-details-btn"
                onClick={() => {
                  const backData = {
                    backTo: "/student/tutors",
                    backButtonLabel: "Tutors",
                    backLabel: "View details",
                  };

                  sessionStorage.setItem("studentTutorBackData", JSON.stringify(backData));

                  navigate(`/student/tutors/${tutor._id}`, {
                    state: backData,
                  });
                }}
              >
                View Details
              </button>











            </article>
          ))}
        </div>
      )}
    </div>
  );
}