
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/Modal";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import api from "../api/axios";
import "./AdminTutorsPage.css";

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
  courseId: "",
  photo: null,
};

function normalizeId(value) {
  if (!value) return "";
  return typeof value === "object" ? value._id : value;
}

function isTutorActive(tutor) {
  return tutor?.isActive === true || tutor?.isActive === "true" || tutor?.isActive === 1;
}

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
    <div className="tutor-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? "star filled" : "star"}>
          ★
        </span>
      ))}
      <b>{fixedRating.toFixed(1)}</b>
    </div>
  );
}










// function getTutorShareText(tutor) {
//   const subjects = Array.isArray(tutor.subjects)
//     ? tutor.subjects.join(", ")
//     : tutor.subjects || "Not added";

//   return `Tutor Details

// Name: ${tutor.name || "Not added"}
// Qualification: ${tutor.qualification || "Not added"}
// Phone: ${tutor.phone || "Not added"}
// Email: ${tutor.email || "Not added"}
// Subjects: ${subjects}
// About: ${tutor.about || "Not added"}
// Rating: ${Number(tutor.averageRating || 0).toFixed(1)}`;
// }

// async function shareTutor(tutor, showAlert) {
//   const text = getTutorShareText(tutor);

//   if (navigator.share) {
//     try {
//       await navigator.share({
//         title: `${tutor.name || "Tutor"} Details`,
//         text,
//       });
//       return;
//     } catch (err) {
//       if (err.name === "AbortError") return;
//     }
//   }

//   try {
//     await navigator.clipboard.writeText(text);
//     showAlert("Tutor details copied. You can paste it on WhatsApp, Email, etc.", "success");
//   } catch {
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
//     window.open(whatsappUrl, "_blank");
//   }
// }















function getTutorShareText(tutor) {
  const subjects = Array.isArray(tutor.subjects)
    ? tutor.subjects.join(", ")
    : tutor.subjects || "Not added";

  return `Tutor Details

Name: ${tutor.name || "Not added"}
Qualification: ${tutor.qualification || "Not added"}
Phone: ${tutor.phone || "Not added"}
Email: ${tutor.email || "Not added"}
Subjects: ${subjects}
About: ${tutor.about || "Not added"}
Rating: ${Number(tutor.averageRating || 0).toFixed(1)}`;
}

async function getShareImageFile(photoUrl, fileName = "tutor-photo.jpg") {
  if (!photoUrl) return null;

  try {
    const response = await fetch(photoUrl);
    const blob = await response.blob();

    return new File([blob], fileName, {
      type: blob.type || "image/jpeg",
    });
  } catch {
    return null;
  }
}

async function shareTutorWithPhoto(tutor, showAlert) {
  const text = getTutorShareText(tutor);
  const photoUrl = tutor.photo ? getMediaUrl(tutor.photo) : "";
  const imageFile = await getShareImageFile(
    photoUrl,
    `${tutor.name || "tutor"}-photo.jpg`
  );

  if (
    imageFile &&
    navigator.canShare &&
    navigator.canShare({ files: [imageFile] })
  ) {
    try {
    await navigator.share({
  title: `${tutor.name || "Tutor"} Photo`,
  files: [imageFile],
});

setTimeout(async () => {
  await navigator.share({
    title: `${tutor.name || "Tutor"} Details`,
    text,
  });
}, 800);
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  if (navigator.share) {
    try {
     await navigator.share({
  title: `${tutor.name || "Tutor"} Details`,
  text: photoUrl ? `Photo: ${photoUrl}\n\n${text}` : text,
});
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(
      photoUrl ? `${text}\n\nPhoto: ${photoUrl}` : text
    );
    showAlert("Tutor details copied with photo link", "success");
  } catch {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      photoUrl ? `${text}\n\nPhoto: ${photoUrl}` : text
    )}`;
    window.open(whatsappUrl, "_blank");
  }
}

















export default function AdminTutorsPage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [tutors, setTutors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const selectedCategory = useMemo(
    () => categories.find((c) => c._id === form.categoryId),
    [categories, form.categoryId]
  );

  const isOnlineTuition = selectedCategory?.key === "online_tuition";

  const visibleCourses = useMemo(() => {
    return courses.filter((course) => {
      const courseCategoryId = normalizeId(course.categoryId);

      if (courseCategoryId !== form.categoryId) return false;

      if (selectedCategory?.key === "online_tuition") {
        if (!form.sectionType) return false;
        return course.sectionType === form.sectionType;
      }

      return true;
    });
  }, [courses, form.categoryId, form.sectionType, selectedCategory]);

  const filteredTutors = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tutors;

    return tutors.filter((tutor) =>
      String(tutor.name || "").toLowerCase().includes(q)
    );
  }, [tutors, search]);

  async function fetchData() {
    try {
      setLoading(true);

      const [tutorRes, catRes, courseRes] = await Promise.all([
        api.get("/admin/tuter/all"),
        api.get("/admin/category/all"),
        api.get("/admin/course/all"),
      ]);

      setTutors(tutorRes.data.tuters || []);
      setCategories(catRes.data.categories || []);
      setCourses(courseRes.data.courses || []);
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function openAddModal() {
    setEditingTutor(null);
    setForm(emptyForm);
    setPreview("");
    setModalOpen(true);
  }

  function openEditModal(tutor) {
    const categoryId = normalizeId(tutor.categoryId);

    const categoryObj =
      typeof tutor.categoryId === "object"
        ? tutor.categoryId
        : categories.find((cat) => cat._id === categoryId);

    const online = categoryObj?.key === "online_tuition";

    setEditingTutor(tutor);
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
      sectionType: online ? tutor.sectionType || "" : "none",
      syllabus: online ? tutor.syllabus || "" : "none",
      courseId: normalizeId(tutor.courseId),
      photo: null,
    });

    setPreview(tutor.photo ? getMediaUrl(tutor.photo) : "");
    setModalOpen(true);
    setMenuOpenId(null);
  }

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files?.[0] || null;
      setForm((prev) => ({ ...prev, photo: file }));
      if (file) setPreview(URL.createObjectURL(file));
      return;
    }

    if (name === "categoryId") {
      const selectedCat = categories.find((cat) => cat._id === value);

      setForm((prev) => ({
        ...prev,
        categoryId: value,
        sectionType: selectedCat?.key === "online_tuition" ? "" : "none",
        syllabus: selectedCat?.key === "online_tuition" ? "" : "none",
        courseId: "",
      }));
      return;
    }

    if (name === "sectionType") {
      setForm((prev) => ({
        ...prev,
        sectionType: value,
        courseId: "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function submitTutor(e) {
    e.preventDefault();

    try {
      if (!form.name.trim()) return showAlert("Tutor name required", "error");
      if (!form.phone.trim()) return showAlert("Phone required", "error");
      if (!form.categoryId) return showAlert("Category select cheyyuka", "error");

      if (isOnlineTuition && !form.sectionType) {
        return showAlert("One-to-One / Batch select cheyyuka", "error");
      }

      if (isOnlineTuition && !form.syllabus) {
        return showAlert("Syllabus select cheyyuka", "error");
      }

      if (!form.courseId) return showAlert("Course / Batch select cheyyuka", "error");

      const finalSectionType = isOnlineTuition ? form.sectionType : "none";
      const finalSyllabus = isOnlineTuition ? form.syllabus : "none";

      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("phone", form.phone.trim());
      fd.append("qualification", form.qualification.trim());
      fd.append("about", form.about.trim());
      fd.append("subjects", form.subjects.trim());
      fd.append("categoryId", form.categoryId);
      fd.append("courseId", form.courseId);
      fd.append("sectionType", finalSectionType);
      fd.append("syllabus", finalSyllabus);

      if (form.photo) fd.append("photo", form.photo);

      if (editingTutor) {
        await api.put(`/admin/tuter/update/${editingTutor._id}`, fd);
      } else {
        await api.post("/admin/tuter/create", fd);
      }

      showAlert(
        editingTutor ? "Tutor updated successfully" : "Tutor added successfully",
        "success"
      );

      setModalOpen(false);
      setEditingTutor(null);
      setForm(emptyForm);
      setPreview("");
      fetchData();
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    }
  }

  function askDeleteTutor(tutor) {
    setDeleteTarget(tutor);
    setConfirmOpen(true);
    setMenuOpenId(null);
  }

  async function confirmDeleteTutor() {
    if (!deleteTarget) return;

    try {
      await api.delete(`/admin/tuter/delete/${deleteTarget._id}`);

      showAlert("Tutor deleted successfully", "success");
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    }
  }

  async function toggleStatus(tutor) {
    try {
      const currentActive = isTutorActive(tutor);

      await api.patch(`/admin/tuter/status/${tutor._id}`, {
        isActive: !currentActive,
      });

      showAlert(
        currentActive
          ? "Tutor deactivated successfully"
          : "Tutor activated successfully",
        "success"
      );

      setMenuOpenId(null);
      fetchData();
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    }
  }

  return (
    <div className="tutor-page" onClick={() => setMenuOpenId(null)}>
      <div className="tutor-toolbar" onClick={(e) => e.stopPropagation()}>
        <div className="tutor-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutors..."
          />
        </div>

        <button type="button" className="tutor-add-btn" onClick={openAddModal}>
          + Add Tutor
        </button>
      </div>

      {loading ? (
        <div className="tutor-state">Loading tutors...</div>
      ) : filteredTutors.length === 0 ? (
        <div className="tutor-state">No tutors found</div>
      ) : (
        <div className="tutor-grid">
          {filteredTutors.map((tutor) => {
            const active = isTutorActive(tutor);

            return (
              <article
                key={tutor._id}
                className={`tutor-card ${!active ? "tutor-card--inactive" : ""}`}
                onClick={(e) => e.stopPropagation()}
              >
                {!active && <span className="inactive-badge">Inactive</span>}

                <div className="tutor-menu-wrap">
                  <button
                    className="tutor-menu-btn"
                    type="button"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === tutor._id ? null : tutor._id)
                    }
                  >
                    ⋮
                  </button>

                  {menuOpenId === tutor._id && (
                    <div className="tutor-menu">
                      <button type="button" onClick={() => openEditModal(tutor)}>
                        ✎ Edit
                      </button>
                      <button type="button" onClick={() => askDeleteTutor(tutor)}>
                        🗑 Delete
                      </button>

                      <button
  type="button"
  onClick={() => {
    setMenuOpenId(null);
shareTutorWithPhoto(tutor, showAlert);  }}
>
  ↗ Share
</button>



                      <button type="button" onClick={() => toggleStatus(tutor)}>
                        {active ? "⏻ Deactive" : "✓ Active"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="tutor-card-top">
                  <div className="tutor-avatar">
                    {tutor.photo ? (
                      <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
                    ) : (
                      <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
                    )}
                  </div>

                  <div>
                    <h3>{tutor.name}</h3>
                    <p>{tutor.qualification || "Qualification not added"}</p>
                  </div>
                </div>

                <p className="tutor-about">
                  {tutor.about || "No description added"}
                </p>

                <Stars rating={tutor.averageRating} />

                <button
                  type="button"
                  className="view-details-btn"
                  onClick={() => navigate(`/admin/tutors/${tutor._id}`)}
                >
                  View Details
                </button>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editingTutor ? "Edit Tutor" : "Add Tutor"}
        width="850px"
        onClose={() => setModalOpen(false)}
      >
        <form className="tutor-form" onSubmit={submitTutor}>
          <div className="tutor-form-grid">
            <label className="form-field">
              <span>Tutor Photo</span>
              <input type="file" name="photo" accept="image/*" onChange={handleChange} />
            </label>

            {preview && (
              <div className="tutor-photo-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}

            <label className="form-field">
              <span>Name</span>
              <input name="name" value={form.name} onChange={handleChange} />
            </label>

            <label className="form-field">
              <span>Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </label>

            <label className="form-field">
              <span>Phone</span>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>

            <label className="form-field">
              <span>Qualification</span>
              <input name="qualification" value={form.qualification} onChange={handleChange} />
            </label>

            <label className="form-field form-field--full">
              <span>About / Description</span>
              <textarea name="about" rows="3" value={form.about} onChange={handleChange} />
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
              <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </label>

            {isOnlineTuition && (
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
                </select>
              </label>
            )}

            {isOnlineTuition && (
              <label className="form-field">
                <span>Syllabus</span>
                <select name="syllabus" value={form.syllabus} onChange={handleChange}>
                  <option value="">Select syllabus</option>
                  <option value="state">State</option>
                  <option value="cbse">CBSE</option>
                  <option value="icse">ICSE</option>
                </select>
              </label>
            )}

            <label className="form-field">
              <span>{isOnlineTuition && form.sectionType === "batch" ? "Batch" : "Course / Class"}</span>
              <select
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                disabled={!form.categoryId || (isOnlineTuition && !form.sectionType)}
              >
                <option value="">
                  {isOnlineTuition && form.sectionType === "batch"
                    ? "Select batch"
                    : "Select course"}
                </option>

                {visibleCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {editingTutor ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={confirmOpen}
        title="Delete Tutor"
        width="430px"
        onClose={() => setConfirmOpen(false)}
      >
        <div className="delete-confirm-box">
          <p>
            <b>{deleteTarget?.name}</b> Do you want to delete this tutor?
          </p>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={() => setConfirmOpen(false)}>
              Cancel
            </button>
            <button type="button" className="danger-btn" onClick={confirmDeleteTutor}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}





