
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "../Components/Modal";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import api from "../api/axios";
import "./AdminTutorDetailsPage.css";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  qualification: "",
  about: "",
  subjects: "",
  categoryId: "",
  sectionType: "",
  syllabus: "",
  courseIds: [],
  photo: null,
};

function normalizeId(value) {
  if (!value) return "";
  return typeof value === "object" ? value._id : value;
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

function getImageSrc(value) {
  if (!value) return "";

  const src = String(value).trim();

  if (
    src.startsWith("data:image") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  return getMediaUrl(src);
}

function getStudentName(review) {
  return review?.studentId?.name || review?.studentName || "Student";
}

function getStudentPhoto(review) {
  return review?.studentId?.photo || review?.studentPhoto || review?.photo || "";
}

function isTutorActive(tutor) {
  return (
    tutor?.isActive === true ||
    tutor?.isActive === "true" ||
    tutor?.isActive === 1
  );
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

function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function Stars({ rating = 0, compact = false }) {
  const fixedRating = Number(rating || 0);
  const rounded = Math.round(fixedRating);

  return (
    <div className={compact ? "detail-stars detail-stars--compact" : "detail-stars"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= rounded ? "detail-star filled" : "detail-star"}
        >
          ★
        </span>
      ))}
      {!compact && <b>{fixedRating.toFixed(1)}</b>}
    </div>
  );
}

function getTutorShareText(tutor) {
  const subjects = Array.isArray(tutor.subjects)
    ? tutor.subjects.join(", ")
    : tutor.subjects || "Not added";

  return `Tutor Details

Name: ${tutor.name || "Not added"}
Qualification: ${tutor.qualification || "Not added"}
Phone: ${tutor.phone || "Not added"}
Email: ${tutor.email || "Not added"}
Course / Class: ${getCourseNames(tutor) || "Not added"}
Syllabus: ${formatSyllabus(tutor.syllabus)}
Subjects: ${subjects}
About: ${tutor.about || "Not added"}
Rating: ${Number(tutor.averageRating || 0).toFixed(1)}`;
}

function getTutorShareLink(tutor) {
  return `${window.location.origin}/student/tutors/${tutor._id}`;
}

async function shareTutorDetails(tutor, showAlert) {
  const tutorLink = getTutorShareLink(tutor);

  const text = `Tutor Profile Link

View ${tutor.name || "Tutor"} profile using the link below:

${tutorLink}

Login to view full tutor details.`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${tutor.name || "Tutor"} Profile`,
        text,
      });

      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(text);

    showAlert("Tutor profile link copied successfully", "success");
  } catch {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  }
}

function ReviewCard({ review }) {
  const photo = getStudentPhoto(review);
  const photoSrc = getImageSrc(photo);
  const name = getStudentName(review);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="review-card">
      <div className="review-card__left">
        <div className="review-avatar">
          {photoSrc && !imageError ? (
            <img
              src={photoSrc}
              alt={name}
              onError={() => setImageError(true)}
            />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div>
          <h4>{name}</h4>
          <p>{review.review || review.comment || "No review text added."}</p>
        </div>
      </div>

      <Stars rating={review.rating} compact />
    </div>
  );
}

export default function AdminTutorDetailsPage() {
  const { tuterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();

  const backTo = location.state?.backTo || "/admin/tutors";

  const [tutor, setTutor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);


const [assignedStudentsOpen, setAssignedStudentsOpen] = useState(false);
const [assignedStudents, setAssignedStudents] = useState([]);
const [assignedStudentsLoading, setAssignedStudentsLoading] = useState(false);


  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((c) => c._id === form.categoryId),
    [categories, form.categoryId]
  );

  const visibleCourses = useMemo(() => {
    return courses.filter((course) => {
      const courseCategoryId = normalizeId(course.categoryId);

      if (courseCategoryId !== form.categoryId) return false;

      if (selectedCategory?.key === "online_tuition") {
        if (!form.sectionType) return false;

        if (form.sectionType === "both") {
          return (
            course.sectionType === "one_to_one" ||
            course.sectionType === "batch"
          );
        }

        return course.sectionType === form.sectionType;
      }

      return true;
    });
  }, [courses, form.categoryId, form.sectionType, selectedCategory]);

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

  async function fetchData() {
    try {
      setLoading(true);

      const [tutorRes, catRes, courseRes] = await Promise.all([
        api.get(`/tuter/${tuterId}`),
        api.get("/admin/category/all"),
        api.get("/admin/course/all"),
      ]);

      setTutor(tutorRes.data.tuter || null);
      setCategories(catRes.data.categories || []);
      setCourses(courseRes.data.courses || []);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load tutor details"), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tuterId]);

  function openEditModal() {
    if (!tutor) return;

    const categoryId = normalizeId(tutor.categoryId);

    const categoryObj =
      typeof tutor.categoryId === "object"
        ? tutor.categoryId
        : categories.find((cat) => cat._id === categoryId);

    const isOnlineTuition = categoryObj?.key === "online_tuition";

    const existingCourseIds =
      Array.isArray(tutor.courseIds) && tutor.courseIds.length > 0
        ? tutor.courseIds.map((course) => normalizeId(course)).filter(Boolean)
        : tutor.courseId
        ? [normalizeId(tutor.courseId)]
        : [];

    setForm({
      name: tutor.name || "",
      email: tutor.email || "",
      phone: tutor.phone || "",
      qualification: tutor.qualification || "",
      about: tutor.about || "",
      subjects: Array.isArray(tutor.subjects)
        ? tutor.subjects.join(", ")
        : tutor.subjects || "",
      categoryId,
      sectionType: isOnlineTuition ? tutor.sectionType || "" : "none",
      syllabus: isOnlineTuition ? tutor.syllabus || "" : "none",
      courseIds: existingCourseIds,
      photo: null,
    });

    setPreview(tutor.photo ? getImageSrc(tutor.photo) : "");
    setEditOpen(true);
  }

  useEffect(() => {
    if (!loading && tutor && location.state?.openEdit && !editOpen) {
      openEditModal();

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, tutor?._id, location.state?.openEdit, editOpen]);

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files?.[0] || null;

      setForm((prev) => ({
        ...prev,
        photo: file,
      }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      }

      return;
    }

    if (name === "categoryId") {
      const selectedCat = categories.find((cat) => cat._id === value);
      const isOnline = selectedCat?.key === "online_tuition";

      setForm((prev) => ({
        ...prev,
        categoryId: value,
        sectionType: isOnline ? "" : "none",
        syllabus: isOnline ? "" : "none",
        courseIds: [],
      }));

      return;
    }

    if (name === "sectionType") {
      setForm((prev) => ({
        ...prev,
        sectionType: value,
        courseIds: [],
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function toggleCourseSelection(courseId, checked) {
    setForm((prev) => {
      const currentCourseIds = Array.isArray(prev.courseIds)
        ? prev.courseIds
        : [];

      return {
        ...prev,
        courseIds: checked
          ? Array.from(new Set([...currentCourseIds, courseId]))
          : currentCourseIds.filter((id) => id !== courseId),
      };
    });
  }

  async function updateTutor(e) {
    e.preventDefault();

    try {
      if (!form.name.trim()) {
        return showAlert("Tutor name required", "error");
      }

      if (!form.phone.trim()) {
        return showAlert("Phone required", "error");
      }

      if (!form.categoryId) {
        return showAlert("Category select cheyyuka", "error");
      }

      if (selectedCategory?.key === "online_tuition" && !form.sectionType) {
        return showAlert("One-to-One / Batch select cheyyuka", "error");
      }

      if (
        selectedCategory?.key === "online_tuition" &&
        !String(form.syllabus || "").trim()
      ) {
        return showAlert("Syllabus select cheyyuka", "error");
      }

      if (!Array.isArray(form.courseIds) || form.courseIds.length === 0) {
        return showAlert("At least one Course / Batch select cheyyuka", "error");
      }

      setSubmitting(true);

      const finalSectionType =
        selectedCategory?.key === "online_tuition" ? form.sectionType : "none";

      const finalSyllabus =
        selectedCategory?.key === "online_tuition"
          ? String(form.syllabus).trim()
          : "none";

      const fd = new FormData();

      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("phone", form.phone.trim());
      fd.append("qualification", form.qualification.trim());
      fd.append("about", form.about.trim());
      fd.append("subjects", form.subjects.trim());
      fd.append("categoryId", form.categoryId);
      fd.append("courseId", form.courseIds[0]);

      form.courseIds.forEach((courseId) => {
        fd.append("courseIds", courseId);
      });

      fd.append("sectionType", finalSectionType);
      fd.append("syllabus", finalSyllabus);

      if (form.photo) {
        fd.append("photo", form.photo);
      }

      await api.put(`/admin/tuter/update/${tuterId}`, fd);

      showAlert("Tutor updated successfully", "success");
      setEditOpen(false);
      fetchData();
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteTutor() {
    try {
      setSubmitting(true);

      await api.delete(`/admin/tuter/delete/${tuterId}`);

      showAlert("Tutor deleted successfully", "success");
      setDeleteOpen(false);
      navigate(backTo);
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  }

  function contactTutor() {
    const phone = String(tutor?.phone || "").replace(/\D/g, "");

    if (!phone) {
      showAlert("Tutor phone number not added", "error");
      return;
    }

    window.open(`tel:${phone}`, "_self");
  }


async function openAssignedStudentsModal() {
  try {
    setAssignedStudentsOpen(true);
    setAssignedStudentsLoading(true);

    const { data } = await api.get(
      `/admin/tuter/${tuterId}/assigned-students`
    );

    setAssignedStudents(data.students || []);
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to load assigned students"), "error");
  } finally {
    setAssignedStudentsLoading(false);
  }
}



  if (loading) {
    return (
      <div className="tutor-detail-page">
        <div className="detail-state">Loading tutor details...</div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="tutor-detail-page">
        <div className="detail-state">Tutor not found</div>
      </div>
    );
  }

  const active = isTutorActive(tutor);
  const isOnlineTuition = tutor?.categoryId?.key === "online_tuition";
  const tutorPhotoSrc = getImageSrc(tutor.photo);

  return (
    <div className="tutor-detail-page">
      <div className="detail-breadcrumb">
        <button type="button" onClick={() => navigate(backTo)}>
          ← Tutors
        </button>
        <span>»</span>
        <b>View details</b>
      </div>

      <div className="detail-card">
        <div className="detail-actions">
          {!active && <span className="detail-inactive-badge">Inactive</span>}

          <button type="button" className="detail-edit-btn" onClick={openEditModal}>
            ✎ Edit
          </button>

          <button
            type="button"
            className="detail-share-btn"
            onClick={() => shareTutorDetails(tutor, showAlert)}
          >
            ↗ Share
          </button>

          <button
  type="button"
  className="detail-assigned-btn"
  onClick={openAssignedStudentsModal}
>
  👥 Assigned Students
</button>

          <button
            type="button"
            className="detail-delete-btn"
            onClick={() => setDeleteOpen(true)}
          >
            🗑 Delete
          </button>
        </div>

        <div className="detail-head">
          <div className="detail-avatar">
            {tutorPhotoSrc ? (
              <img src={tutorPhotoSrc} alt={tutor.name} />
            ) : (
              <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
            )}
          </div>

          <div className="detail-title">
            <h2>{tutor.name}</h2>
            <p>{tutor.qualification || "Qualification not added"}</p>
            <Stars rating={tutor.averageRating} />
          </div>
        </div>

        <div className="detail-info-grid">
          <div className="detail-info-box">
            <span>Phone</span>
            <b>{tutor.phone || "Not added"}</b>
          </div>

          <div className="detail-info-box">
            <span>Email</span>
            <b>{tutor.email || "Not added"}</b>
          </div>

          <div className="detail-info-box">
            <span>Course / Class</span>
            <b>{getCourseNames(tutor) || "Not added"}</b>
          </div>

          {isOnlineTuition && (
            <div className="detail-info-box">
              <span>Syllabus</span>
              <b>{formatSyllabus(tutor.syllabus)}</b>
            </div>
          )}
        </div>

        <section className="detail-section">
          <h3>About</h3>
          <p>{tutor.about || "No description added."}</p>
        </section>

        <section className="detail-section">
          <h3>Subjects</h3>

          {subjects.length ? (
            <div className="subject-pills">
              {subjects.map((subject) => (
                <span key={subject}>{subject}</span>
              ))}
            </div>
          ) : (
            <p>No subjects added.</p>
          )}
        </section>

        <section className="detail-section">
          <div className="reviews-head">
            <h3>Recent Reviews</h3>

            {tutor.reviews?.length > 2 && (
              <button
                type="button"
                className="show-more-btn"
                onClick={() => setReviewsOpen(true)}
              >
                Show more
              </button>
            )}
          </div>

          {recentReviews.length ? (
            <div className="review-list">
              {recentReviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          ) : (
            <div className="empty-reviews">No reviews yet.</div>
          )}

          {tutor.reviews?.length > 0 && tutor.reviews?.length <= 2 && (
            <button
              type="button"
              className="show-more-btn show-more-btn--single"
              onClick={() => setReviewsOpen(true)}
            >
              Show more
            </button>
          )}
        </section>

        <button
          type="button"
          className="tutor-contact-btn"
          onClick={contactTutor}
        >
          Contact
        </button>
      </div>

      <Modal
        open={reviewsOpen}
        title="All Reviews"
        width="760px"
        onClose={() => setReviewsOpen(false)}
      >
        {tutor.reviews?.length ? (
          <div className="all-reviews-list">
            {tutor.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        ) : (
          <div className="empty-reviews">No reviews yet.</div>
        )}
      </Modal>

      <Modal
        open={editOpen}
        title="Edit Tutor"
        width="850px"
        onClose={() => setEditOpen(false)}
      >
        <form className="detail-form" onSubmit={updateTutor}>
          <div className="detail-form-grid">
            <label className="form-field">
              <span>Tutor Photo</span>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
              />
            </label>

            {preview && (
              <div className="detail-photo-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}

            <label className="form-field">
              <span>Name</span>
              <input name="name" value={form.name} onChange={handleChange} />
            </label>

            <label className="form-field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </label>

            <label className="form-field">
              <span>Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>

            <label className="form-field">
              <span>Qualification</span>
              <input
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
              />
            </label>

            <label className="form-field form-field--full">
              <span>About / Description</span>
              <textarea
                name="about"
                rows="3"
                value={form.about}
                onChange={handleChange}
              />
            </label>

            <label className="form-field form-field--full">
              <span>Subject</span>
              <input
                name="subjects"
                placeholder="Example: Mathematics, Physics"
                value={form.subjects}
                onChange={handleChange}
              />
            </label>

            <label className="form-field">
              <span>Category</span>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </label>

            {selectedCategory?.key === "online_tuition" && (
              <label className="form-field">
                <span>Class Type</span>
                <select
                  name="sectionType"
                  value={form.sectionType}
                  onChange={handleChange}
                >
                  <option value="">Select class type</option>
                  <option value="one_to_one">One-to-One</option>
                  <option value="batch">Batch</option>
                  <option value="both">Both</option>
                </select>
              </label>
            )}

            {selectedCategory?.key === "online_tuition" && (
              <label className="form-field">
                <span>Syllabus</span>
                <input
                  type="text"
                  name="syllabus"
                  value={form.syllabus}
                  onChange={handleChange}
                  placeholder="Example: State, CBSE, ICSE"
                />
              </label>
            )}

            <div className="form-field">
              <span>
                {selectedCategory?.key === "online_tuition" &&
                form.sectionType === "batch"
                  ? "Batch"
                  : selectedCategory?.key === "online_tuition" &&
                    form.sectionType === "both"
                  ? "Courses / Batches"
                  : "Course / Class"}
              </span>

              <div className="course-checkbox-list">
                {visibleCourses.length === 0 ? (
                  <p className="course-empty-text">No courses found</p>
                ) : (
                  visibleCourses.map((course) => {
                    const checked = Array.isArray(form.courseIds)
                      ? form.courseIds.includes(course._id)
                      : false;

                    return (
                      <label key={course._id} className="course-check-item">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) =>
                            toggleCourseSelection(course._id, e.target.checked)
                          }
                        />

                        <span>
                          {course.name}
                          {selectedCategory?.key === "online_tuition" &&
                          form.sectionType === "both"
                            ? course.sectionType === "batch"
                              ? " - Batch"
                              : " - One-to-One"
                            : ""}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>

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
        title="Delete Tutor"
        width="430px"
        onClose={() => setDeleteOpen(false)}
      >
        <div className="delete-confirm-box">
          <p>
            <b>{tutor.name}</b> Do you want to delete this tutor?
          </p>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setDeleteOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="danger-btn"
              onClick={deleteTutor}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

<Modal
  open={assignedStudentsOpen}
  title={`Assigned Students${tutor?.name ? ` - ${tutor.name}` : ""}`}
  width="760px"
  onClose={() => setAssignedStudentsOpen(false)}
>
  <div className="assigned-students-box">
    {assignedStudentsLoading ? (
      <div className="assigned-students-state">Loading students...</div>
    ) : assignedStudents.length === 0 ? (
      <div className="assigned-students-state">
        No students assigned to this tutor yet.
      </div>
    ) : (
      <div className="assigned-students-list">
        {assignedStudents.map((student) => {
          const photo = student.photo ? getImageSrc(student.photo) : "";

          return (
            <div key={student._id} className="assigned-student-card">
              <div className="assigned-student-avatar">
                {photo ? (
                  <img src={photo} alt={student.name || "Student"} />
                ) : (
                  <span>{student.name?.charAt(0)?.toUpperCase() || "S"}</span>
                )}
              </div>

              <div className="assigned-student-info">
                <h4>{student.name || "Student"}</h4>
                <p>{student.email || "No email added"}</p>
                <small>{student.phone || "No phone added"}</small>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
</Modal>

    </div>
  );
}