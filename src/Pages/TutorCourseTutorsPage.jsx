import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import "./TutorCourseTutorsPage.css";

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
    <div className="tutor-course-tutor-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={
            n <= rounded
              ? "tutor-course-star filled"
              : "tutor-course-star"
          }
        >
          ★
        </span>
      ))}

      <b>{fixedRating.toFixed(1)}</b>
    </div>
  );
}

export default function TutorCourseTutorsPage() {
  const { categoryId, courseId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  const { showAlert } = useAlert();

  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const savedCourseData = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(`tutorCourseTutor_${courseId}`) || "{}"
      );
    } catch {
      return {};
    }
  })();

  const courseName =
    location.state?.courseName ||
    savedCourseData?.courseName ||
    "Selected Course";

  useEffect(() => {
    if (courseName && courseName !== "Selected Course") {
      sessionStorage.setItem(
        `tutorCourseTutor_${courseId}`,
        JSON.stringify({ courseName })
      );
    }
  }, [courseId, courseName]);

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
        String(tutor.qualification || "")
          .toLowerCase()
          .includes(q) ||
        String(tutor.about || "").toLowerCase().includes(q)
      );
    });
  }, [tutors, search]);

  return (
    <div className="tutor-course-tutors-page">
      {/* <div className="tutor-course-tutors-breadcrumb">
        <button
          type="button"
          onClick={() => navigate(`/tutor/courses/${categoryId}`)}
        >
          ← Courses
        </button>

        <span>»</span>

        <b>{courseName} tutors</b>
      </div>

      <div className="tutor-course-tutors-search"> */}






<div className="tutor-course-tutors-breadcrumb">
  <button
    type="button"
    onClick={() => navigate(`/tutor/courses/${categoryId}`)}
  >
    ← Courses
  </button>

  <span>»</span>

  <b>Tutors</b>
</div>

<div className="tutor-course-tutors-page-head">
  <h2>{courseName} tutors</h2>
</div>

<div className="tutor-course-tutors-search">





        <span>⌕</span>

        <input
          type="text"
          placeholder="Search tutors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="tutor-course-tutor-state">
          Loading tutors...
        </div>
      ) : filteredTutors.length === 0 ? (
        <div className="tutor-course-tutor-state">
          No tutors found.
        </div>
      ) : (
        <div className="tutor-course-tutor-grid">
          {filteredTutors.map((tutor) => (
            <article
              className="tutor-course-tutor-card"
              key={tutor._id}
            >
              <div className="tutor-course-tutor-card-top">
                <div className="tutor-course-tutor-avatar">
                  {tutor.photo ? (
                    <img
                      src={getMediaUrl(tutor.photo)}
                      alt={tutor.name}
                    />
                  ) : (
                    <span>
                      {tutor.name?.charAt(0)?.toUpperCase() || "T"}
                    </span>
                  )}
                </div>

                <div className="tutor-course-tutor-info">
                  <h3>{tutor.name || "Tutor"}</h3>

                  <p>
                    {tutor.qualification ||
                      "Qualification not added"}
                  </p>
                </div>
              </div>

              <p className="tutor-course-tutor-about">
                {tutor.about || "No description added"}
              </p>

              <Stars rating={tutor.averageRating} />

              {/* <button
                type="button"
                className="tutor-course-view-details-btn"
                onClick={() => {}}
              >
                View Details
              </button> */}









<button
  type="button"
  className="tutor-course-view-details-btn"
  onClick={() => {
    const backData = {
      backTo: `/tutor/courses/${categoryId}/tutors/${courseId}`,
      backButtonLabel: "Tutors",
      backLabel: "View details",
      courseName: courseName || "Selected Course",
    };

    sessionStorage.setItem(
      "tutorTutorBackData",
      JSON.stringify(backData)
    );

    navigate(`/tutor/tutors/${tutor._id}`, {
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