

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";

function getErrorMessage(error, fallback = "Failed to fetch categories") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function getFallbackIcon(title = "") {
  const value = String(title).toLowerCase();

  if (value.includes("online")) return "💻";
  if (value.includes("talent") || value.includes("tallent")) return "🎭";
  if (value.includes("skill")) return "🛠️";

  return "📚";
}

export default function StudentCategorySection() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCategories() {
    try {
      setLoading(true);

      const { data } = await api.get("/category/all");
      setCategories(data.categories || []);
    } catch (error) {
      showAlert(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="student-category-section">
      <div className="student-category-head">
        <h2>Our Courses</h2>
      </div>

      {loading ? (
        <div className="student-state-card">Loading courses...</div>
      ) : categories.length === 0 ? (
        <div className="student-state-card">No courses found.</div>
      ) : (
        <div className="student-category-grid">
          {categories.map((category) => (
            <article className="student-category-card" key={category._id}>
              <div className="student-category-media">
                {category.image ? (
                  <img src={getMediaUrl(category.image)} alt={category.title} />
                ) : (
                  <div className="student-category-fallback">
                    {getFallbackIcon(category.title)}
                  </div>
                )}
              </div>

              <div className="student-category-body">
                <h3>{category.title}</h3>
                <p>
                  {category.description ||
                    "Explore flexible learning courses with expert guidance."}
                </p>

                <button
                  type="button"
                  className="student-category-btn"
                  onClick={() => navigate(`/student/courses/${category._id}`)}
                >
                  View Courses
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}