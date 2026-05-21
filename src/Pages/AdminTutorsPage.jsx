

import { FiEye, FiEyeOff } from "react-icons/fi";

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Components/Modal";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import api from "../api/axios";
import "./AdminTutorsPage.css";

// const emptyForm = {
//   name: "",
//   email: "",
//   phone: "",
//   qualification: "",
//   about: "",
//   subjects: "",
//   categoryId: "",
//   sectionType: "",
//   syllabus: "",
//   courseIds: [],
//   photo: null,
// };



// const emptyForm = {
//   name: "",
//   email: "",
//   phone: "",
//   qualification: "",
//   about: "",
//   subjects: "",
//   categoryIds: [],
//   syllabus: "",
//   courseIds: [],
//   photo: null,
// };







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

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");


///////////////////////////////////////////////////////////////////////////////////////////////

const [showTutorPassword, setShowTutorPassword] = useState(false);
const [passwordLoading, setPasswordLoading] = useState(false);
////////////////////////////////////////////////////////////////////////////////////////////




  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // const selectedCategory = useMemo(() => {
  //   return categories.find((cat) => cat._id === form.categoryId);
  // }, [categories, form.categoryId]);

  // const isOnlineTuition = selectedCategory?.key === "online_tuition";

  // const visibleCourses = useMemo(() => {
  //   return courses.filter((course) => {
  //     const courseCategoryId = normalizeId(course.categoryId);

  //     if (courseCategoryId !== form.categoryId) return false;

  //     if (isOnlineTuition) {
  //       if (!form.sectionType) return false;

  //       if (form.sectionType === "both") {
  //         return course.sectionType === "one_to_one" || course.sectionType === "batch";
  //       }

  //       return course.sectionType === form.sectionType;
  //     }

  //     return true;
  //   });
  // }, [courses, form.categoryId, form.sectionType, isOnlineTuition]);






const selectedCategories = useMemo(() => {
  return categories.filter((cat) => form.categoryIds.includes(cat._id));
}, [categories, form.categoryIds]);

const isOnlineTuition = useMemo(() => {
  return selectedCategories.some((cat) => cat.key === "online_tuition");
}, [selectedCategories]);

const visibleCourses = useMemo(() => {
  if (!Array.isArray(form.categoryIds) || form.categoryIds.length === 0) {
    return [];
  }

  return courses.filter((course) => {
    const courseCategoryId = normalizeId(course.categoryId);
    return form.categoryIds.includes(courseCategoryId);
  });
}, [courses, form.categoryIds]);









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





//////////////////////////////////////////////////////////////////////////////////////////


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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  // function openAddModal() {
  //   setEditingTutor(null);
  //   setForm({ ...emptyForm, courseIds: [] });
  //   setPreview("");
  //   setModalOpen(true);
  // }







// function openAddModal() {
//   setEditingTutor(null);
//   setForm({ ...emptyForm, categoryIds: [], courseIds: [] });
//   setPreview("");
//   setModalOpen(true);
// }















//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function openAddModal() {
  setEditingTutor(null);
  setPreview("");
  setShowTutorPassword(false);

  setForm({
    ...emptyForm,
    categoryIds: [],
    courseIds: [],
    loginPasswordText: "",
  });

  setModalOpen(true);

  const password = await fetchTutorPassword();

  setForm((prev) => ({
    ...prev,
    loginPasswordText: password,
  }));
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  // function openEditModal(tutor) {
  //   const categoryId = normalizeId(tutor.categoryId);

  //   const categoryObj =
  //     typeof tutor.categoryId === "object"
  //       ? tutor.categoryId
  //       : categories.find((cat) => cat._id === categoryId);

  //   const online = categoryObj?.key === "online_tuition";

  //   const existingCourseIds =
  //     Array.isArray(tutor.courseIds) && tutor.courseIds.length
  //       ? tutor.courseIds.map((course) => normalizeId(course))
  //       : tutor.courseId
  //       ? [normalizeId(tutor.courseId)]
  //       : [];

  //   setEditingTutor(tutor);

  //   setForm({
  //     name: tutor.name || "",
  //     email: tutor.email || "",
  //     phone: tutor.phone || "",
  //     qualification: tutor.qualification || "",
  //     about: tutor.about || "",
  //     subjects: Array.isArray(tutor.subjects)
  //       ? tutor.subjects.join(", ")
  //       : tutor.subjects || "",
  //     categoryId,
  //     sectionType: online ? tutor.sectionType || "" : "none",
  //     syllabus: online ? tutor.syllabus || "" : "none",
  //     courseIds: existingCourseIds,
  //     photo: null,
  //   });

  //   setPreview(tutor.photo ? getMediaUrl(tutor.photo) : "");
  //   setModalOpen(true);
  //   setMenuOpenId(null);
  // }






function openEditModal(tutor) {
  const existingCategoryIds =
    Array.isArray(tutor.categoryIds) && tutor.categoryIds.length
      ? tutor.categoryIds.map((cat) => normalizeId(cat))
      : tutor.categoryId
      ? [normalizeId(tutor.categoryId)]
      : [];

  const existingCourseIds =
    Array.isArray(tutor.courseIds) && tutor.courseIds.length
      ? tutor.courseIds.map((course) => normalizeId(course))
      : tutor.courseId
      ? [normalizeId(tutor.courseId)]
      : [];

  const onlineSelected = existingCategoryIds.some((catId) => {
    const cat = categories.find((item) => item._id === catId);
    return cat?.key === "online_tuition";
  });

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
    categoryIds: existingCategoryIds,
    syllabus: onlineSelected ? tutor.syllabus || "" : "none",
    courseIds: existingCourseIds,

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
loginPasswordText: tutor.loginPasswordText || "",
    ///////////////////////////////////////////////////////////////////////////////////////////

    photo: null,
  });

  setPreview(tutor.photo ? getMediaUrl(tutor.photo) : "");
  setModalOpen(true);
  setMenuOpenId(null);
}






//////////////////////////////////////////////////////////////////////////////////////////////////////////
  // function handleChange(e) {
  //   const { name, value, files } = e.target;

  //   if (name === "photo") {
  //     const file = files?.[0] || null;

  //     setForm((prev) => ({
  //       ...prev,
  //       photo: file,
  //     }));

  //     if (file) {
  //       setPreview(URL.createObjectURL(file));
  //     }

  //     return;
  //   }

  //   if (name === "categoryId") {
  //     const selectedCat = categories.find((cat) => cat._id === value);
  //     const online = selectedCat?.key === "online_tuition";

  //     setForm((prev) => ({
  //       ...prev,
  //       categoryId: value,
  //       sectionType: online ? "" : "none",
  //       syllabus: online ? "" : "none",
  //       courseIds: [],
  //     }));

  //     return;
  //   }

  //   if (name === "sectionType") {
  //     setForm((prev) => ({
  //       ...prev,
  //       sectionType: value,
  //       courseIds: [],
  //     }));

  //     return;
  //   }

  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // }






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



// function toggleCategorySelection(categoryId, checked) {
//   setForm((prev) => {
//     const currentCategoryIds = Array.isArray(prev.categoryIds)
//       ? prev.categoryIds
//       : [];

//     const nextCategoryIds = checked
//       ? Array.from(new Set([...currentCategoryIds, categoryId]))
//       : currentCategoryIds.filter((id) => id !== categoryId);

//     const allowedCourseIds = courses
//       .filter((course) => nextCategoryIds.includes(normalizeId(course.categoryId)))
//       .map((course) => course._id);

//     return {
//       ...prev,
//       categoryIds: nextCategoryIds,
//       courseIds: prev.courseIds.filter((courseId) =>
//         allowedCourseIds.includes(courseId)
//       ),
//       syllabus: nextCategoryIds.some((catId) => {
//         const cat = categories.find((item) => item._id === catId);
//         return cat?.key === "online_tuition";
//       })
//         ? prev.syllabus === "none"
//           ? ""
//           : prev.syllabus
//         : "none",
//     };
//   });
// }









function toggleCategorySelection(categoryId, checked) {
  setForm((prev) => {
    const currentCategoryIds = Array.isArray(prev.categoryIds)
      ? prev.categoryIds.map(String)
      : [];

    const currentCourseIds = Array.isArray(prev.courseIds)
      ? prev.courseIds.map(String)
      : [];

    const selectedCategoryId = String(categoryId);

    const nextCategoryIds = checked
      ? Array.from(new Set([...currentCategoryIds, selectedCategoryId]))
      : currentCategoryIds.filter((id) => id !== selectedCategoryId);

    const allowedCourseIds = courses
      .filter((course) =>
        nextCategoryIds.includes(String(normalizeId(course.categoryId)))
      )
      .map((course) => String(course._id));

    const nextCourseIds = currentCourseIds.filter((courseId) =>
      allowedCourseIds.includes(String(courseId))
    );

    const hasOnlineTuition = nextCategoryIds.some((catId) => {
      const cat = categories.find((item) => String(item._id) === String(catId));
      return cat?.key === "online_tuition";
    });

    return {
      ...prev,
      categoryIds: nextCategoryIds,
      courseIds: nextCourseIds,
      syllabus: hasOnlineTuition
        ? prev.syllabus === "none"
          ? ""
          : prev.syllabus || ""
        : "none",
    };
  });
}

  function toggleCourseSelection(courseId, checked) {
    setForm((prev) => {
      const currentCourseIds = Array.isArray(prev.courseIds) ? prev.courseIds : [];

      return {
        ...prev,
        courseIds: checked
          ? Array.from(new Set([...currentCourseIds, courseId]))
          : currentCourseIds.filter((id) => id !== courseId),
      };
    });
  }

  async function submitTutor(e) {
    e.preventDefault();

    try {
      if (!form.name.trim()) {
        return showAlert("Tutor name required", "error");
      }

      if (!form.phone.trim()) {
        return showAlert("Phone required", "error");
      }

      // if (!form.categoryId) {
      //   return showAlert("Category select cheyyuka", "error");
      // }

      // if (isOnlineTuition && !form.sectionType) {
      //   return showAlert("One-to-One / Batch select cheyyuka", "error");
      // }





if (!Array.isArray(form.categoryIds) || form.categoryIds.length === 0) {
  return showAlert("At least one category select cheyyuka", "error");
}

if (isOnlineTuition && !String(form.syllabus || "").trim()) {
  return showAlert("Syllabus enter cheyyuka", "error");
}

if (!Array.isArray(form.courseIds) || form.courseIds.length === 0) {
  return showAlert("At least one Course / Class select cheyyuka", "error");
}






      if (isOnlineTuition && !String(form.syllabus || "").trim()) {
        return showAlert("Syllabus enter cheyyuka", "error");
      }

      if (!Array.isArray(form.courseIds) || form.courseIds.length === 0) {
        return showAlert("At least one Course / Batch select cheyyuka", "error");
      }

      // const finalSectionType = isOnlineTuition ? form.sectionType : "none";
      // const finalSyllabus = isOnlineTuition ? String(form.syllabus).trim() : "none";

      // const fd = new FormData();

      // fd.append("name", form.name.trim());
      // fd.append("email", form.email.trim());
      // fd.append("phone", form.phone.trim());
      // fd.append("qualification", form.qualification.trim());
      // fd.append("about", form.about.trim());
      // fd.append("subjects", form.subjects.trim());
      // fd.append("categoryId", form.categoryId);
      // fd.append("sectionType", finalSectionType);
      // fd.append("syllabus", finalSyllabus);

      // form.courseIds.forEach((courseId) => {
      //   fd.append("courseIds", courseId);
      // });

      // fd.append("courseId", form.courseIds[0]);

      // if (form.photo) {
      //   fd.append("photo", form.photo);
      // }






const finalSyllabus = isOnlineTuition ? String(form.syllabus).trim() : "none";
const finalSectionType = isOnlineTuition ? "both" : "none";

const fd = new FormData();

fd.append("name", form.name.trim());
fd.append("email", form.email.trim());
fd.append("phone", form.phone.trim());
fd.append("qualification", form.qualification.trim());
fd.append("about", form.about.trim());
fd.append("subjects", form.subjects.trim());

form.categoryIds.forEach((categoryId) => {
  fd.append("categoryIds", categoryId);
});

fd.append("categoryId", form.categoryIds[0]);

fd.append("sectionType", finalSectionType);
fd.append("syllabus", finalSyllabus);

form.courseIds.forEach((courseId) => {
  fd.append("courseIds", courseId);
});

fd.append("courseId", form.courseIds[0]);



///////////////////////////////////////////////////////////////////////////////////////

if (!editingTutor) {
  fd.append("loginPasswordText", form.loginPasswordText);
}

//////////////////////////////////////////////////////////////////////////////////////////////////

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



/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// async function toggleTutorBlockStatus(tutor) {
//   try {
//     const nextBlocked = !isTutorBlocked(tutor);

//     const { data } = await api.patch(`/admin/tuter/block/${tutor._id}`, {
//       isBlocked: nextBlocked,
//     });

//     setTutors((prev) =>
//       prev.map((item) =>
//         item._id === tutor._id
//           ? {
//               ...item,
//               isBlocked: data?.tuter?.isBlocked ?? nextBlocked,
//             }
//           : item
//       )
//     );

//     setMenuOpenId(null);

//     showAlert(
//       nextBlocked
//         ? "Tutor blocked successfully. Tutor cannot login now."
//         : "Tutor unblocked successfully. Tutor can login now.",
//       "success"
//     );
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to update tutor block status"), "error");
//   }
// }












async function toggleTutorBlockStatus(tutor) {
  try {
    const nextBlocked = !isTutorBlocked(tutor);

    const { data } = await api.patch(`/admin/tuter/block/${tutor._id}`, {
      isBlocked: nextBlocked,
    });

    setTutors((prev) =>
      prev.map((item) =>
        item._id === tutor._id
          ? {
              ...item,
              isBlocked: data?.tuter?.isBlocked ?? nextBlocked,
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
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to update block status"), "error");
  }
}










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////














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
            // const active = isTutorActive(tutor);

            // return (
            //   <article
            //     key={tutor._id}
            //     className={`tutor-card ${!active ? "tutor-card--inactive" : ""}`}
            //     onClick={(e) => e.stopPropagation()}
            //   >
            //     {!active && <span className="inactive-badge">Inactive</span>}




            const active = isTutorActive(tutor);

return (
  // <article
  //   key={tutor._id}
  //   className={`tutor-card ${
  //     isTutorBlocked(tutor)
  //       ? "tutor-card--blocked"
  //       : !active
  //       ? "tutor-card--inactive"
  //       : ""
  //   }`}
  //   onClick={(e) => e.stopPropagation()}
  // >





<article
  key={tutor._id}
  className={`tutor-card ${
    isTutorBlocked(tutor)
      ? "tutor-card--blocked"
      : !isTutorActive(tutor)
      ? "tutor-card--inactive"
      : ""
  }`}
  onClick={(e) => e.stopPropagation()}
>




    {/* {isTutorBlocked(tutor) ? (
      <span className="blocked-badge">Blocked</span>
    ) : !active ? (
      <span className="inactive-badge">Inactive</span>
    ) : null} */}





{isTutorBlocked(tutor) ? (
  <span className="blocked-badge">Blocked</span>
) : !isTutorActive(tutor) ? (
  <span className="inactive-badge">Inactive</span>
) : null}






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

                     

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpenId(null);
                          shareTutorLink(tutor, showAlert);
                        }}
                      >
                        ↗ Share
                      </button>

                      <button type="button" onClick={() => toggleStatus(tutor)}>
                        {active ? "⏻ Deactive" : "✓ Active"}
                      </button>


{/* <button type="button" onClick={() => toggleTutorBlockStatus(tutor)}>
  {isTutorBlocked(tutor) ? "🔓 Unblock" : "⛔ Block"}
</button> */}





<button type="button" onClick={() => toggleTutorBlockStatus(tutor)}>
  {isTutorBlocked(tutor) ? "🔓 Unblock" : "⛔ Block"}
</button>


 <button type="button" onClick={() => askDeleteTutor(tutor)}>
                        🗑 Delete
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







{/* 

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
            </label> */}








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
  <span>Tutor Login Password</span>

  <div className="tutor-password-field">
    <input
      type={showTutorPassword ? "text" : "password"}
      value={passwordLoading ? "Generating..." : form.loginPasswordText || ""}
      readOnly
      placeholder="Auto generated password"
    />

    {/* <button
      type="button"
      className="tutor-password-eye"
      onClick={() => setShowTutorPassword((prev) => !prev)}
      title={showTutorPassword ? "Hide password" : "Show password"}
    >
      {showTutorPassword ? "🙈" : "👁"}
    </button> */}




<button
  type="button"
  className="tutor-password-eye"
  onClick={() => setShowTutorPassword((prev) => !prev)}
  title={showTutorPassword ? "Hide password" : "Show password"}
>
  {showTutorPassword ? <FiEyeOff /> : <FiEye />}
</button>






  </div>

  {!editingTutor && (
    <small className="tutor-password-note">
      This password is auto generated from backend. Tutor can login using email/phone and this password.
    </small>
  )}

  {editingTutor && (
    <small className="tutor-password-note">
      Password is visible only. Admin cannot edit or delete tutor password.
    </small>
  )}
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








{/* 
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
                  <option value="both">Both</option>
                </select>
              </label>
            )}

            {isOnlineTuition && (
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
                {isOnlineTuition && form.sectionType === "batch"
                  ? "Batch"
                  : isOnlineTuition && form.sectionType === "both"
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
                          {isOnlineTuition && form.sectionType === "both"
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
            </div> */}






<div className="form-field form-field--full">
  <span>Categories</span>

  <div className="course-checkbox-list tutor-category-checkbox-list">
    {categories.length === 0 ? (
      <p className="course-empty-text">No categories found</p>
    ) : (
      categories.map((cat) => {
        const checked = Array.isArray(form.categoryIds)
          ? form.categoryIds.includes(cat._id)
          : false;

        return (
          <label key={cat._id} className="course-check-item">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) =>
                toggleCategorySelection(cat._id, e.target.checked)
              }
            />

            <span>{cat.title}</span>
          </label>
        );
      })
    )}
  </div>
</div>

{isOnlineTuition && (
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
)}

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
            >
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
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}