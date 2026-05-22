import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import "./StudentCourseTutorsPage.css";

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
    <div className="student-course-tutor-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= rounded ? "student-course-star filled" : "student-course-star"}
        >
          ★
        </span>
      ))}
      <b>{fixedRating.toFixed(1)}</b>
    </div>
  );
}

export default function StudentCourseTutorsPage() {
  const { categoryId, courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();

  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const courseName = location.state?.courseName || "Tutors";

  async function fetchTutors() {
    try {
      setLoading(true);
      const { data } = await api.get(`/tuter/by-course/${courseId}`);
      setTutors(data.tuters || []);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
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

    return tutors.filter((tutor) => {
      return (
        String(tutor.name || "").toLowerCase().includes(q) ||
        String(tutor.qualification || "").toLowerCase().includes(q) ||
        String(tutor.about || "").toLowerCase().includes(q)
      );
    });
  }, [tutors, search]);

  return (
    <div className="student-course-tutors-page">
      <div className="student-course-tutors-breadcrumb">
        <button
          type="button"
          onClick={() => navigate(`/student/courses/${categoryId}`)}
        >
          ← Tutors
        </button>
        <span>»</span>
        <b>{courseName}</b>
      </div>

      <div className="student-course-tutors-search">
        <span>⌕</span>
        <input
          type="text"
          placeholder="Search tutors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="student-course-tutor-state">Loading tutors...</div>
      ) : filteredTutors.length === 0 ? (
        <div className="student-course-tutor-state">No tutors found.</div>
      ) : (
        <div className="student-course-tutor-grid">
          {filteredTutors.map((tutor) => (
            <article className="student-course-tutor-card" key={tutor._id}>
              <div className="student-course-tutor-card-top">
                <div className="student-course-tutor-avatar">
                  {tutor.photo ? (
                    <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
                  ) : (
                    <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
                  )}
                </div>

                <div className="student-course-tutor-info">
                  <h3>{tutor.name || "Tutor"}</h3>
                  <p>{tutor.qualification || "Qualification not added"}</p>
                </div>
              </div>

              <p className="student-course-tutor-about">
                {tutor.about || "No description added"}
              </p>

              <Stars rating={tutor.averageRating} />

              <button
                type="button"
                className="student-course-view-details-btn"
                // onClick={() => navigate(`/student/tutors/${tutor._id}`)}


                onClick={() =>
  navigate(`/student/tutors/${tutor._id}`, {
    state: {
      backTo: `/student/courses/${categoryId}/tutors/${courseId}`,
      courseName,
    },
  })
}


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