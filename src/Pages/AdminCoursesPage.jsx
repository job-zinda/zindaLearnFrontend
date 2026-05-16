



import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import Modal from "../Components/Modal";

const emptyForm = {
  name: "",
  description: "",
  image: null,
  sectionType: "one_to_one",
};

function normalizeKey(category) {
  if (category?.key) return category.key;

  const title = String(category?.title || "").toLowerCase().trim();

  if (title.includes("online")) return "online_tuition";
  if (title.includes("talent")) return "talent_base";
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

function FallbackCourseMedia({ seedValue, categoryKey, sectionType }) {
  const variant = getFallbackVariant(seedValue);
  const icon = getFallbackIcon(categoryKey, sectionType);

  return (
    <div className={`course-fallback course-fallback--${variant}`}>
      <span>{icon}</span>
    </div>
  );
}

function CourseCard({
  course,
  categoryKey,
  onEdit,
  onDelete,
  onViewTutors,
  actionLabel = "View Tutors",
}) {
  return (
    <div className="admin-course-card">
      <div className="admin-course-card__hover-actions">
        <button
          type="button"
          className="course-hover-icon"
          title="Edit"
          onClick={() => onEdit(course)}
        >
         Edit ✎
        </button>

        <button
          type="button"
          className="course-hover-icon delete"
          title="Delete"
          onClick={() => onDelete(course)}
        >
         Delete 🗑
        </button>
      </div>

      <div className="admin-course-card__image">
        {course.image ? (
          <img src={getMediaUrl(course.image)} alt={course.name} />
        ) : (
          <FallbackCourseMedia
            seedValue={`${course._id || course.name}-${categoryKey}-${course.sectionType}`}
            categoryKey={categoryKey}
            sectionType={course.sectionType}
          />
        )}
      </div>

      <div className="admin-course-card__body">
        <h3>{course.name}</h3>
        <p>{course.description || "No description added yet."}</p>

        <div className="admin-course-card__footer">
          <button
            type="button"
            className="course-action-btn"
            onClick={() => onViewTutors(course)}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCoursesPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeSection, setActiveSection] = useState("one_to_one");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const categoryKey = useMemo(() => normalizeKey(category), [category]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [categoryRes, coursesRes] = await Promise.all([
        api.get(`/category/${categoryId}`),
        api.get("/admin/course/all"),
      ]);

      const fetchedCategory = categoryRes.data?.category || null;
      const allCourses = coursesRes.data?.courses || [];

      const filtered = allCourses.filter((course) => {
        const currentCategoryId =
          typeof course.categoryId === "object"
            ? course.categoryId?._id
            : course.categoryId;

        return String(currentCategoryId) === String(categoryId);
      });

      setCategory(fetchedCategory);
      setCourses(filtered);
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
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const displayedCourses = useMemo(() => {
    let filteredCourses = courses;

    if (categoryKey === "online_tuition") {
      filteredCourses = filteredCourses.filter((course) => {
        if (activeSection === "one_to_one") {
          return course.sectionType === "one_to_one";
        }

        return course.sectionType === "batch";
      });
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();

      filteredCourses = filteredCourses.filter((course) => {
        return (
          String(course.name || "").toLowerCase().includes(q) ||
          String(course.description || "").toLowerCase().includes(q)
        );
      });
    }

    return filteredCourses;
  }, [courses, categoryKey, activeSection, searchTerm]);

  const pageHeading = useMemo(() => {
    if (!category?.title) return "Courses";
    return category.title;
  }, [category]);

  const addButtonLabel =
    categoryKey === "online_tuition" && activeSection === "batch"
      ? "+ Add Batch"
      : "+ Add Course";

  const createModalTitle =
    categoryKey === "online_tuition" && activeSection === "batch"
      ? "Add Batch"
      : "Add Course";

  const nameLabel =
    categoryKey === "online_tuition" && activeSection === "batch"
      ? "Batch Name"
      : "Class or Course Name";

  const namePlaceholder =
    categoryKey === "online_tuition" && activeSection === "batch"
      ? "Enter batch name"
      : "Enter class or course name";

  const openCourseTutors = (course) => {
    navigate(`/admin/courses/${categoryId}/tutors/${course._id}`, {
      state: {
        categoryTitle: category?.title || "Courses",
        courseName: course.name,
        backTo: `/admin/courses/${categoryId}`,
      },
    });
  };

  const openCreateModal = () => {
    setForm({
      ...emptyForm,
      sectionType: categoryKey === "online_tuition" ? activeSection : "none",
    });
    setCreateOpen(true);
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setForm({
      name: course.name || "",
      description: course.description || "",
      image: null,
      sectionType: course.sectionType || "one_to_one",
    });
    setEditOpen(true);
  };

  const openDeleteModal = (course) => {
    setSelectedCourse(course);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCourse(null);
    setDeleteOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      showAlert(
        categoryKey === "online_tuition" && activeSection === "batch"
          ? "Batch name is required"
          : "Course name is required",
        "error"
      );
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("categoryId", categoryId);
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());

      if (categoryKey === "online_tuition") {
        formData.append("sectionType", activeSection);
      }

      if (form.image) {
        formData.append("image", form.image);
      }

      await api.post("/admin/course/create", formData);

      showAlert(
        categoryKey === "online_tuition" && activeSection === "batch"
          ? "Batch created successfully"
          : "Course created successfully"
      );

      setCreateOpen(false);
      setForm(emptyForm);
      fetchData();
    } catch (error) {
      showAlert(
        error?.response?.data?.msg ||
          error?.response?.data?.error ||
          "Failed to create course",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedCourse) return;

    if (!form.name.trim()) {
      showAlert("Course name is required", "error");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());

      if (categoryKey === "online_tuition") {
        formData.append("sectionType", selectedCourse.sectionType || form.sectionType);
      }

      if (form.image) {
        formData.append("image", form.image);
      }

      await api.put(`/admin/course/update/${selectedCourse._id}`, formData);

      showAlert("Course updated successfully");
      setEditOpen(false);
      setSelectedCourse(null);
      setForm(emptyForm);
      fetchData();
    } catch (error) {
      showAlert(
        error?.response?.data?.msg ||
          error?.response?.data?.error ||
          "Failed to update course",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteCourse = async () => {
    if (!selectedCourse) return;

    try {
      setSubmitting(true);
      await api.delete(`/admin/course/delete/${selectedCourse._id}`);

      showAlert(
        selectedCourse.sectionType === "batch"
          ? "Batch deleted successfully"
          : "Course deleted successfully"
      );

      closeDeleteModal();
      fetchData();
    } catch (error) {
      showAlert(
        error?.response?.data?.msg ||
          error?.response?.data?.error ||
          "Failed to delete course",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-courses-page">
        <div className="state-card">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="admin-courses-page">
      <div className="courses-breadcrumb">
        <button
          type="button"
          className="courses-breadcrumb__back"
          onClick={() => navigate("/admin")}
          aria-label="Go back to Home"
        >
          ←
        </button>

        <button
          type="button"
          className="courses-breadcrumb__link"
          onClick={() => navigate("/admin")}
        >
          Home
        </button>

        <span className="courses-breadcrumb__sep">»</span>
        <span className="courses-breadcrumb__current">Courses</span>
      </div>

      <div className="courses-page-head">
        <h2>{pageHeading}</h2>
      </div>

      {categoryKey === "online_tuition" ? (
        <>
          <div className="courses-tabs">
            <button
              type="button"
              className={`courses-tab ${
                activeSection === "one_to_one" ? "courses-tab--active" : ""
              }`}
              onClick={() => setActiveSection("one_to_one")}
            >
              <span className="courses-tab__title">One-to-One Session</span>
              <span className="courses-tab__subtitle">Get personalized attention with one to one sessions tailored to your learning speed and goals.</span>
            </button>

            <button
              type="button"
              className={`courses-tab ${
                activeSection === "batch" ? "courses-tab--active" : ""
              }`}
              onClick={() => setActiveSection("batch")}
            >
              <span className="courses-tab__title">Group / Batch Session</span>
              <span className="courses-tab__subtitle">Learn together with peers in structured batch environments improve collaboration and knowledge sharing.</span>
            </button>
          </div>

          <section className="courses-block">
            <div className="courses-toolbar">
              <div className="courses-search-wrap">
                <div className="courses-search-box">
                  <span className="courses-search-icon">⌕</span>
                  <input
                    type="text"
                    className="courses-search-input"
                    placeholder={
                      activeSection === "batch"
                        ? "Search batches..."
                        : "Search courses..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                className="course-add-lite-btn"
                onClick={openCreateModal}
              >
                {addButtonLabel}
              </button>
            </div>

            {displayedCourses.length === 0 ? (
              <div className="state-card">
                No {activeSection === "one_to_one" ? "one-to-one classes" : "batches"} found.
              </div>
            ) : (
              <div className="admin-course-grid">
                {displayedCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    categoryKey={categoryKey}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onViewTutors={openCourseTutors}
                    actionLabel="View Tutors"
                  />
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="courses-block">
          <div className="courses-toolbar">
            <div className="courses-search-wrap">
              <div className="courses-search-box">
                <span className="courses-search-icon">⌕</span>
                <input
                  type="text"
                  className="courses-search-input"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className="course-add-lite-btn"
              onClick={openCreateModal}
            >
              + Add Course
            </button>
          </div>

          {displayedCourses.length === 0 ? (
            <div className="state-card">No courses found.</div>
          ) : (
            <div className="admin-course-grid">
              {displayedCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  categoryKey={categoryKey}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onViewTutors={openCourseTutors}
                  actionLabel="View Tutors"
                />
              ))}
            </div>
          )}
        </section>
      )}

      <Modal
        open={createOpen}
        title={createModalTitle}
        onClose={() => setCreateOpen(false)}
        width="680px"
      >
        <form className="form-grid" onSubmit={handleCreate}>
          <label className="form-field">
            <span>{nameLabel}</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder={namePlaceholder}
              required
            />
          </label>

          <label className="form-field">
            <span>Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  image: e.target.files?.[0] || null,
                }))
              }
            />
          </label>

          <label className="form-field">
            <span>Description</span>
            <textarea
              rows="5"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter description"
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setCreateOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting
                ? "Adding..."
                : categoryKey === "online_tuition" && activeSection === "batch"
                ? "Add Batch"
                : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={editOpen}
        title={
          selectedCourse?.sectionType === "batch" ? "Edit Batch" : "Edit Course"
        }
        onClose={() => setEditOpen(false)}
        width="680px"
      >
        <form className="form-grid" onSubmit={handleUpdate}>
          {selectedCourse?.image ? (
            <div className="preview-box preview-box--large">
              <img
                src={getMediaUrl(selectedCourse.image)}
                alt={selectedCourse.name}
              />
            </div>
          ) : null}

          <label className="form-field">
            <span>
              {selectedCourse?.sectionType === "batch"
                ? "Batch Name"
                : "Class or Course Name"}
            </span>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </label>

          <label className="form-field">
            <span>Change Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  image: e.target.files?.[0] || null,
                }))
              }
            />
          </label>

          <label className="form-field">
            <span>Description</span>
            <textarea
              rows="5"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setEditOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteOpen}
        title={
          selectedCourse?.sectionType === "batch" ? "Delete Batch" : "Delete Course"
        }
        onClose={closeDeleteModal}
        width="520px"
      >
        <div className="delete-confirm-box">
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedCourse?.name || "this course"}</strong>?
          </p>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={closeDeleteModal}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="danger-btn"
              onClick={confirmDeleteCourse}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}