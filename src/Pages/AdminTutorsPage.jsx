

import { FiEye, FiEyeOff } from "react-icons/fi";

// import React, { useEffect, useMemo, useState } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
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
  categoryIds: [],
  syllabus: "",
  courseIds: [],
  loginPasswordText: "",
  photo: null,
};







function normalizeId(value) {
  if (!value) return "";
  return typeof value === "object" ? value._id : value;
}



function getCourseCategory(course, categories) {
  const courseCategoryId = normalizeId(course.categoryId);
  return categories.find((cat) => cat._id === courseCategoryId);
}



function deriveCategoryIdsFromCourseIds(courseIds, courses) {
  if (!Array.isArray(courseIds) || courseIds.length === 0) return [];

  const selectedCourseIds = courseIds.map(String);

  const derivedCategoryIds = courses
    .filter((course) => selectedCourseIds.includes(String(course._id)))
    .map((course) => normalizeId(course.categoryId))
    .filter(Boolean)
    .map(String);

  return Array.from(new Set(derivedCategoryIds));
}



function getCourseLabel(course, categories) {
  const category = getCourseCategory(course, categories);
  const isOnline = category?.key === "online_tuition";

  if (!isOnline) {
    return course.name;
  }

  if (course.sectionType === "one_to_one") {
    return `${course.name} - One-to-One`;
  }

  if (course.sectionType === "batch") {
    return `${course.name} - Batch`;
  }

  return course.name;
}



function isTutorActive(tutor) {
  return tutor?.isActive === true || tutor?.isActive === "true" || tutor?.isActive === 1;
}




function isTutorBlocked(tutor) {
  return (
    tutor?.isBlocked === true ||
    tutor?.isBlocked === "true" ||
    tutor?.isBlocked === 1
  );
}






const tutorFilterOptions = [
  {
    key: "all",
    label: "All Tutors",
  },
  {
    key: "active",
    label: "Active Tutors",
  },
  {
    key: "deactive",
    label: "Deactive Tutors",
  },
  {
    key: "blocked",
    label: "Blocked Tutors",
  },
];

const tutorFilterLabels = {
  all: "All Tutors",
  active: "Active Tutors",
  deactive: "Deactive Tutors",
  blocked: "Blocked Tutors",
};





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






function TutorAddIcon() {
  return (
    <span className="tutor-add-btn__icon" aria-hidden="true">
      <span className="tutor-add-btn__plus">+</span>

      <svg
        className="tutor-add-btn__user"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21c.8-4 3.6-6 7.5-6s6.7 2 7.5 6" />
      </svg>
    </span>
  );
}





function TutorFilterIcon() {
  return (
    <svg
      className="tutor-filter-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6h16L14 13v5.2c0 .35-.18.67-.48.86l-3 1.9A1 1 0 0 1 9 20.1V13L4 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 6h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}





function TutorDarkModal({ open, title, width = "760px", onClose, children }) {
  if (!open) return null;

  return createPortal(
    <div className="tutor-dark-modal-overlay" onMouseDown={onClose}>
      <div
        className="tutor-dark-modal"
        style={{ width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="tutor-dark-modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="tutor-dark-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="tutor-dark-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}







function getTutorShareLink(tutor) {
  return `${window.location.origin}/student/tutors/${tutor._id}`;
}

async function shareTutorLink(tutor, showAlert) {
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

export default function AdminTutorsPage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [tutors, setTutors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [loading, setLoading] = useState(false);




const [tutorFilter, setTutorFilter] = useState("all");
const [filterOpen, setFilterOpen] = useState(false);
const filterWrapRef = useRef(null);


  const [modalOpen, setModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");



  const [showTutorPassword, setShowTutorPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);




  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [submitting, setSubmitting] = useState(false);













  const visibleCourses = useMemo(() => {
    return Array.isArray(courses) ? courses : [];
  }, [courses]);








  // const filteredTutors = useMemo(() => {
  //   const q = search.toLowerCase().trim();
  //   if (!q) return tutors;

  //   return tutors.filter((tutor) =>
  //     String(tutor.name || "").toLowerCase().includes(q)
  //   );
  // }, [tutors, search]);






const filteredTutors = useMemo(() => {
  let result = tutors;

  if (tutorFilter === "active") {
    result = result.filter(
      (tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor)
    );
  }

  if (tutorFilter === "deactive") {
    result = result.filter(
      (tutor) => !isTutorActive(tutor) && !isTutorBlocked(tutor)
    );
  }

  if (tutorFilter === "blocked") {
    result = result.filter((tutor) => isTutorBlocked(tutor));
  }

  const q = search.toLowerCase().trim();

  if (!q) return result;

  return result.filter((tutor) => {
    return (
      String(tutor.name || "").toLowerCase().includes(q) ||
      String(tutor.email || "").toLowerCase().includes(q) ||
      String(tutor.phone || "").toLowerCase().includes(q) ||
      String(tutor.qualification || "").toLowerCase().includes(q) ||
      String(tutor.about || "").toLowerCase().includes(q)
    );
  });
}, [tutors, search, tutorFilter]);






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












  async function openTutorChat(tutor) {
    try {
      if (isTutorBlocked(tutor)) {
        showAlert("Blocked tutor chat is disabled", "error");
        return;
      }

      const tutorUserId =
        typeof tutor?.loginUserId === "object"
          ? tutor.loginUserId?._id
          : tutor?.loginUserId;

      if (!tutorUserId) {
        return showAlert("Tutor login user id not found", "error");
      }

      const { data } = await api.post(`/chat/admin-tutor-room/${tutorUserId}`);

      const roomId = data?.room?._id || data?.chatRoom?._id || data?.roomId;

      if (roomId) {
        navigate(`/admin/chats?roomId=${roomId}&open=chat`);
      } else {
        navigate("/admin/chats");
      }
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to open tutor chat"), "error");
    }
  }







  useEffect(() => {
    fetchData();
  }, []);




useEffect(() => {
  function handleOutsideFilterClick(e) {
    if (
      filterWrapRef.current &&
      !filterWrapRef.current.contains(e.target)
    ) {
      setFilterOpen(false);
    }
  }

  document.addEventListener("mousedown", handleOutsideFilterClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideFilterClick);
  };
}, []);







  async function fetchTutorPassword() {
    try {
      setPasswordLoading(true);

      const { data } = await api.get("/admin/tuter/generate-password");

      return data?.password || "";
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to generate tutor password"), "error");
      return "";
    } finally {
      setPasswordLoading(false);
    }
  }







  async function openAddModal() {
    setEditingTutor(null);
    setPreview("");
    setShowTutorPassword(false);
    setSubmitting(false);






    setForm({
      ...emptyForm,
      categoryIds: [],
      courseIds: [],
      syllabus: "",
      loginPasswordText: "",
    });





    setModalOpen(true);

    const password = await fetchTutorPassword();

    setForm((prev) => ({
      ...prev,
      loginPasswordText: password,
    }));
  }






  function openEditModal(tutor) {






    const existingCourseIds =
      Array.isArray(tutor.courseIds) && tutor.courseIds.length
        ? tutor.courseIds.map((course) => normalizeId(course)).filter(Boolean)
        : tutor.courseId
          ? [normalizeId(tutor.courseId)]
          : [];

    const derivedCategoryIds = deriveCategoryIdsFromCourseIds(
      existingCourseIds,
      courses
    );

    const existingCategoryIds =
      derivedCategoryIds.length > 0
        ? derivedCategoryIds
        : Array.isArray(tutor.categoryIds) && tutor.categoryIds.length
          ? tutor.categoryIds.map((cat) => normalizeId(cat)).filter(Boolean)
          : tutor.categoryId
            ? [normalizeId(tutor.categoryId)]
            : [];






    setEditingTutor(tutor);
    setSubmitting(false);

    setForm({
      name: tutor.name || "",
      email: tutor.email || "",
      phone: tutor.phone || "",
      qualification: tutor.qualification || "",



      about: tutor.about || "",
      subjects: Array.isArray(tutor.subjects)
        ? tutor.subjects.join(", ")
        : tutor.subjects || "",
      categoryIds: existingCategoryIds,
      // syllabus: onlineSelected ? tutor.syllabus || "" : "none",

      // syllabus:
      //   tutor.syllabus && tutor.syllabus !== "none"
      //     ? tutor.syllabus
      //     : "Not added",



      syllabus:
        tutor.syllabus &&
          tutor.syllabus !== "none" &&
          tutor.syllabus !== "Not added"
          ? tutor.syllabus
          : "",

      courseIds: existingCourseIds,


      loginPasswordText: "",


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

      setForm((prev) => ({
        ...prev,
        photo: file,
      }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      }

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
        ? prev.courseIds.map(String)
        : [];

      const selectedCourseId = String(courseId);

      const nextCourseIds = checked
        ? Array.from(new Set([...currentCourseIds, selectedCourseId]))
        : currentCourseIds.filter((id) => id !== selectedCourseId);

      const nextCategoryIds = deriveCategoryIdsFromCourseIds(
        nextCourseIds,
        courses
      );

      return {
        ...prev,
        courseIds: nextCourseIds,
        categoryIds: nextCategoryIds,

      };
    });
  }
















  async function submitTutor(e) {
    e.preventDefault();

    if (submitting) return;

    try {
      if (!form.name.trim()) {
        return showAlert("Tutor name required", "error");
      }

      if (!form.phone.trim()) {
        return showAlert("Phone required", "error");
      }

      if (!Array.isArray(form.courseIds) || form.courseIds.length === 0) {
        return showAlert("At least one Course / Class select cheyyuka", "error");
      }

      const autoCategoryIds = deriveCategoryIdsFromCourseIds(
        form.courseIds,
        courses
      );

      if (autoCategoryIds.length === 0) {
        return showAlert("Selected course category not found", "error");
      }

      const autoSelectedCategories = categories.filter((cat) =>
        autoCategoryIds.includes(String(cat._id))
      );

      const autoOnlineTuition = autoSelectedCategories.some(
        (cat) => cat.key === "online_tuition"
      );

      const finalSyllabus =
        form.syllabus && String(form.syllabus).trim()
          ? String(form.syllabus).trim()
          : "Not added";

      const finalSectionType = autoOnlineTuition ? "both" : "none";

      setSubmitting(true);

      const fd = new FormData();

      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("phone", form.phone.trim());
      fd.append("qualification", form.qualification.trim());
      fd.append("about", form.about.trim());
      fd.append("subjects", form.subjects.trim());

      autoCategoryIds.forEach((categoryId) => {
        fd.append("categoryIds", categoryId);
      });

      fd.append("categoryId", autoCategoryIds[0]);

      fd.append("sectionType", finalSectionType);
      fd.append("syllabus", finalSyllabus);

      form.courseIds.forEach((courseId) => {
        fd.append("courseIds", courseId);
      });

      fd.append("courseId", form.courseIds[0]);

      if (!editingTutor) {
        fd.append("loginPasswordText", form.loginPasswordText);
      }

      if (form.photo) {
        fd.append("photo", form.photo);
      }

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
      setForm({ ...emptyForm, courseIds: [] });
      setPreview("");
      fetchData();
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  }








  function askDeleteTutor(tutor) {
    setDeleteTarget(tutor);
    setConfirmOpen(true);
    setMenuOpenId(null);
  }







  async function confirmDeleteTutor() {
    if (!deleteTarget || submitting) return;

    try {
      setSubmitting(true);

      await api.delete(`/admin/tuter/delete/${deleteTarget._id}`);

      showAlert("Tutor deleted successfully", "success");
      setConfirmOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      showAlert(getErrorMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  }
















  async function toggleStatus(tutor) {
    try {
      if (isTutorBlocked(tutor)) {
        showAlert("Blocked tutor cannot be activated. Please unblock first.", "error");
        setMenuOpenId(null);
        return;
      }

      const { data } = await api.patch(`/admin/tuter/status/${tutor._id}`);

      const updatedTutor = data?.tuter;

      setTutors((prev) =>
        prev.map((item) =>
          item._id === tutor._id
            ? {
              ...item,
              isActive: updatedTutor?.isActive ?? !isTutorActive(tutor),
              isBlocked: updatedTutor?.isBlocked ?? item.isBlocked,
            }
            : item
        )
      );

      setMenuOpenId(null);

      showAlert(
        updatedTutor?.isActive
          ? "Tutor activated successfully"
          : "Tutor deactivated successfully",
        "success"
      );

      fetchData();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to update tutor status"), "error");
    }
  }












  async function toggleTutorBlockStatus(tutor) {
    try {
      const nextBlocked = !isTutorBlocked(tutor);

      const { data } = await api.patch(`/admin/tuter/block/${tutor._id}`, {
        isBlocked: nextBlocked,
      });

      const updatedTutor = data?.tuter;

      setTutors((prev) =>
        prev.map((item) =>
          item._id === tutor._id
            ? {
              ...item,
              isBlocked: updatedTutor?.isBlocked ?? nextBlocked,
              isActive: updatedTutor?.isActive ?? !nextBlocked,
            }
            : item
        )
      );

      setMenuOpenId(null);

      showAlert(
        nextBlocked
          ? "Tutor blocked successfully"
          : "Tutor unblocked successfully",
        "success"
      );

      fetchData();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to update block status"), "error");
    }
  }







  return (
    // <div className="tutor-page" onClick={() => setMenuOpenId(null)}>



<div
  className="tutor-page"
  onClick={() => {
    setMenuOpenId(null);
    setFilterOpen(false);
  }}
>






      {/* <div className="tutor-toolbar" onClick={(e) => e.stopPropagation()}>
        <div className="tutor-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutors..."
          />
        </div>






        <button
          type="button"
          className="tutor-add-btn"
          onClick={openAddModal}
          aria-label="Add Tutor"
        >
          <TutorAddIcon />

          <span className="tutor-add-btn__text">Add Tutor</span>
        </button>






      </div> */}









<div className="tutor-toolbar" onClick={(e) => e.stopPropagation()}>
  <div className="tutor-search">
    <span>⌕</span>

    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search tutors..."
    />
  </div>

  <div className="tutor-toolbar-actions">
    <div className="tutor-filter-wrap" ref={filterWrapRef}>
      <button
        type="button"
        className={`tutor-filter-btn ${
          filterOpen ? "tutor-filter-btn--active" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setFilterOpen((prev) => !prev);
          setMenuOpenId(null);
        }}
        aria-label="Filter tutors"
      >
        <TutorFilterIcon />
      </button>

      {filterOpen && (
        <div
          className="tutor-filter-menu"
          onClick={(e) => e.stopPropagation()}
        >
          {tutorFilterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={
                tutorFilter === option.key
                  ? "tutor-filter-option tutor-filter-option--active"
                  : "tutor-filter-option"
              }
              onClick={() => {
                setTutorFilter(option.key);
                setFilterOpen(false);
              }}
            >
              <span className="tutor-filter-check">
                {tutorFilter === option.key ? "✓" : ""}
              </span>

              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>

    <button
      type="button"
      className="tutor-add-btn"
      onClick={openAddModal}
      aria-label="Add Tutor"
    >
      <TutorAddIcon />

      <span className="tutor-add-btn__text">Add Tutor</span>
    </button>
  </div>
{/* </div>










      {loading ? (
        <div className="tutor-state">Loading tutors...</div>
      ) : filteredTutors.length === 0 ? ( */}





</div>

<div className="tutor-list-heading">
  <h2>{tutorFilterLabels[tutorFilter]}</h2>
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
                className={`tutor-card ${isTutorBlocked(tutor)
                  ? "tutor-card--blocked"
                  : !isTutorActive(tutor)
                    ? "tutor-card--inactive"
                    : ""
                  }`}
              >








                {isTutorBlocked(tutor) ? (
                  <span className="blocked-badge">Blocked</span>
                ) : !isTutorActive(tutor) ? (
                  <span className="inactive-badge">Inactive</span>
                ) : null}






                <div className="tutor-menu-wrap">
                  <button
                    className="tutor-menu-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === tutor._id ? null : tutor._id);
                    }}
                  >
                    ⋮
                  </button>

                  {menuOpenId === tutor._id && (
                    <div
                      className="tutor-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button type="button" onClick={() => openEditModal(tutor)}>
                        ✎ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpenId(null);
                          shareTutorLink(tutor, showAlert);
                        }}
                      >
                        ↗ Share
                      </button>





                      <button
                        type="button"
                        disabled={isTutorBlocked(tutor)}
                        className={isTutorBlocked(tutor) ? "tutor-menu-disabled-btn" : ""}
                        onClick={() => {
                          if (isTutorBlocked(tutor)) {
                            showAlert("Blocked tutor cannot be activated. Please unblock first.", "error");
                            return;
                          }

                          toggleStatus(tutor);
                        }}
                      >
                        {active ? "⏻ Deactive" : "✓ Active"}
                      </button>







                      <button type="button" onClick={() => toggleTutorBlockStatus(tutor)}>
                        {isTutorBlocked(tutor) ? "◯ Unblock" : "⊘ Block"}
                      </button>

                      <button type="button" onClick={() => askDeleteTutor(tutor)}>
                        🗑 Delete Account
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





<div
  className={`tutor-card-actions ${
    isTutorBlocked(tutor) ? "tutor-card-actions--blocked" : ""
  }`}
>
  {!isTutorBlocked(tutor) && (
    <button
      type="button"
      className="tutor-chat-btn"
      onClick={(e) => {
        e.stopPropagation();
        openTutorChat(tutor);
      }}
    >
      Chat
    </button>
  )}

  <button
    type="button"
    className="view-details-btn"
    onClick={() => {
      const backData = {
        backTo: "/admin/tutors",
        backButtonLabel: "Tutors",
        backLabel: "View details",
      };

      sessionStorage.setItem("adminTutorBackData", JSON.stringify(backData));

      navigate(`/admin/tutors/${tutor._id}`, {
        state: backData,
      });
    }}
  >
    View Details
  </button>
</div>





              </article>
            );
          })}
        </div>
      )}










      <TutorDarkModal
        open={modalOpen}
        title={editingTutor ? "Edit Tutor" : "Add Tutor"}
        width="820px"
        onClose={() => setModalOpen(false)}
      >
        <form className="tutor-form" onSubmit={submitTutor}>
          <div className="tutor-form-grid">
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









            {!editingTutor && (
              <label className="form-field">
                <span>Tutor Login Password</span>

                <div className="tutor-password-field">
                  <input
                    type={showTutorPassword ? "text" : "password"}
                    value={passwordLoading ? "Generating..." : form.loginPasswordText || ""}
                    readOnly
                    placeholder="Auto generated password"
                  />

                  <button
                    type="button"
                    className="tutor-password-eye"
                    onClick={() => setShowTutorPassword((prev) => !prev)}
                    title={showTutorPassword ? "Hide password" : "Show password"}
                  >
                    {showTutorPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <small className="tutor-password-note">
                  This password is auto generated from backend. Tutor can login using email/phone and this password.
                </small>
              </label>
            )}










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





            <label className="form-field form-field--full">
              <span>Syllabus</span>
              <input
                type="text"
                name="syllabus"
                value={form.syllabus}
                onChange={handleChange}
                placeholder="Example: State, CBSE, ICSE"
              />

            </label>







            <div className="form-field form-field--full">
              <span>Courses / Classes</span>

              <div className="course-checkbox-list tutor-course-checkbox-list">
                {visibleCourses.length === 0 ? (
                  <p className="course-empty-text">No courses found</p>
                ) : (
                  visibleCourses.map((course) => {
                    const checked = Array.isArray(form.courseIds)
                      ? form.courseIds.includes(course._id)
                      : false;

                    const category = getCourseCategory(course, categories);

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
                          {getCourseLabel(course, categories)}
                          {category?.title ? (
                            <small className="course-category-name">
                              {category.title}
                            </small>
                          ) : null}
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
              onClick={() => setModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>







            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting
                ? editingTutor
                  ? "Updating..."
                  : "Adding..."
                : editingTutor
                  ? "Update"
                  : "Add"}
            </button>

          </div>
        </form>
      </TutorDarkModal>









      <TutorDarkModal
        open={confirmOpen}
        title="Delete Tutor"
        width="460px"
        onClose={() => setConfirmOpen(false)}
      >
        <div className="delete-confirm-box tutor-dark-delete-box">
          <p>
            <b>{deleteTarget?.name || "This tutor"}</b> Do you want to delete this
            tutor?
          </p>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </button>





            <button
              type="button"
              className="danger-btn"
              onClick={confirmDeleteTutor}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>





          </div>
        </div>
      </TutorDarkModal>





    </div>
  );
}