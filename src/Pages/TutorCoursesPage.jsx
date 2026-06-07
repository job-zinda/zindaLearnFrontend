import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import "./TutorCoursesPage.css";

function normalizeKey(category) {
  if (category?.key) return category.key;

  const title = String(category?.title || "").toLowerCase();

  if (title.includes("online")) return "online_tuition";
  if (title.includes("talent") || title.includes("tallent")) return "talent_base";
  if (title.includes("skill")) return "skill_base";

  return "general";
}

function getFallbackVariant(seedValue) {
  const source = String(seedValue || "default");
  let hash = 0;

  for (let i = 0; i < source.length; i += 1) {
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
  }

  const variants = ["blue", "purple", "pink", "green"];
  return variants[Math.abs(hash) % variants.length];
}

function getFallbackIcon(categoryKey, sectionType) {
  if (categoryKey === "online_tuition" && sectionType === "batch") return "👥";
  if (categoryKey === "talent_base") return "🎭";
  if (categoryKey === "skill_base") return "🛠️";
  return "📖";
}

function CourseFallback({ seedValue, categoryKey, sectionType }) {
  return (
    <div
      className={`tutor-course-fallback tutor-course-fallback--${getFallbackVariant(
        seedValue
      )}`}
    >
      <span>{getFallbackIcon(categoryKey, sectionType)}</span>
    </div>
  );
}

function CourseCard({
  course,
  categoryKey,
  navigate,
}) {
  return (
    <article className="tutor-course-card">
      <div className="tutor-course-card__image">
        {course.image ? (
          <img src={getMediaUrl(course.image)} alt={course.name} />
        ) : (
          <CourseFallback
            seedValue={`${course._id || course.name}-${categoryKey}-${course.sectionType}`}
            categoryKey={categoryKey}
            sectionType={course.sectionType}
          />
        )}
      </div>

      <div className="tutor-course-card__body">
        <h3>{course.name}</h3>
        <p>{course.description || "No description added yet."}</p>

        <div className="tutor-course-card__footer">
          <button
            type="button"
            className="tutor-course-action-btn"
            // onClick={() => {}}


onClick={() => {
  navigate(
    `/tutor/courses/${course.categoryId}/tutors/${course._id}`,
    {
      state: {
        courseName: course.name,
      },
    }
  );
}}


          >
            View Tutors
          </button>
        </div>
      </div>
    </article>
  );
}

export default function TutorCoursesPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("one_to_one");

  const categoryKey = useMemo(() => normalizeKey(category), [category]);

  async function fetchCourses() {
    try {
      setLoading(true);
      const { data } = await api.get(`/course/by-category/${categoryId}`);
      setCategory(data.category || null);
      setCourses(data.courses || []);
    } catch (error) {
      showAlert(
        error?.response?.data?.msg ||
          error?.response?.data?.error ||
          "Failed to load courses",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, [categoryId]);

  const displayedCourses = useMemo(() => {
    let list = courses;

    if (categoryKey === "online_tuition") {
      list = list.filter((course) =>
        activeSection === "one_to_one"
          ? course.sectionType === "one_to_one"
          : course.sectionType === "batch"
      );
    }

    const q = searchTerm.toLowerCase().trim();
    if (!q) return list;

    return list.filter(
      (course) =>
        String(course.name || "").toLowerCase().includes(q) ||
        String(course.description || "").toLowerCase().includes(q)
    );
  }, [courses, categoryKey, activeSection, searchTerm]);

  if (loading) {
    return (
      <div className="tutor-courses-page">
        <div className="tutor-course-state">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="tutor-courses-page">
      <div className="tutor-courses-breadcrumb">
        <button type="button" onClick={() => navigate("/tutor")}>←</button>
        <button type="button" onClick={() => navigate("/tutor")}>Home</button>
        <span>»</span>
        <b>Courses</b>
      </div>

      <div className="tutor-courses-head">
        <h2>{category?.title || "Courses"}</h2>
      </div>

      {categoryKey === "online_tuition" && (
        <div className="tutor-courses-tabs">
          <button
            type="button"
            className={`tutor-courses-tab ${
              activeSection === "one_to_one" ? "tutor-courses-tab--active" : ""
            }`}
            onClick={() => setActiveSection("one_to_one")}
          >
            <span>One-to-One Session</span>
            <small>
              Get personalized attention with one to one sessions tailored to
              your learning speed and goals.
            </small>
          </button>

          <button
            type="button"
            className={`tutor-courses-tab ${
              activeSection === "batch" ? "tutor-courses-tab--active" : ""
            }`}
            onClick={() => setActiveSection("batch")}
          >
            <span>Group / Batch Session</span>
            <small>
              Learn together with peers in structured batch environments improve
              collaboration and knowledge sharing.
            </small>
          </button>
        </div>
      )}

      <div className="tutor-courses-toolbar">
        <div className="tutor-courses-search">
          <span>⌕</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              categoryKey === "online_tuition" && activeSection === "batch"
                ? "Search batches..."
                : "Search courses..."
            }
          />
        </div>
      </div>

      {displayedCourses.length === 0 ? (
        <div className="tutor-course-state">No courses found.</div>
      ) : (
        <div className="tutor-course-grid">
          {displayedCourses.map((course) => (
           




<CourseCard
  key={course._id}
  course={course}
  categoryKey={categoryKey}
  navigate={navigate}
/>




          ))}
        </div>
      )}
    </div>
  );
}