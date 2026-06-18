



// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Modal from "../Components/Modal";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import api from "../api/axios";
// import "./AdminTutorsPage.css";
// import "./AdminTutorDetailsPage.css";

// function normalizeId(value) {
//   if (!value) return "";
//   return typeof value === "object" ? value._id : value;
// }

// function isTutorActive(tutor) {
//   return tutor?.isActive === true || tutor?.isActive === "true" || tutor?.isActive === 1;
// }

// function getErrorMessage(error) {
//   return (
//     error?.response?.data?.msg ||
//     error?.response?.data?.error ||
//     error?.message ||
//     "Something went wrong"
//   );
// }

// function Stars({ rating = 0 }) {
//   const fixedRating = Number(rating || 0);
//   const rounded = Math.round(fixedRating);

//   return (
//     <div className="tutor-stars">
//       {[1, 2, 3, 4, 5].map((n) => (
//         <span key={n} className={n <= rounded ? "star filled" : "star"}>
//           ★
//         </span>
//       ))}
//       <b>{fixedRating.toFixed(1)}</b>
//     </div>
//   );
// }

// export default function AdminCourseTutorsPage() {
//   const { categoryId, courseId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { showAlert } = useAlert();

//   const [tutors, setTutors] = useState([]);
//   const [search, setSearch] = useState("");
//   const [menuOpenId, setMenuOpenId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const courseName = location.state?.courseName || "Selected Course";
//   const backTo = location.state?.backTo || `/admin/courses/${categoryId}`;

//   async function fetchTutors() {
//     try {
//       setLoading(true);

//       const { data } = await api.get("/admin/tuter/all");
//       const allTutors = data.tuters || [];

//       // const filtered = allTutors.filter((tutor) => {
//       //   return String(normalizeId(tutor.courseId)) === String(courseId);
//       // });



//       const filtered = allTutors.filter((tutor) => {
//   // NEW MULTIPLE COURSE SUPPORT
//   if (Array.isArray(tutor.courseIds) && tutor.courseIds.length > 0) {
//     return tutor.courseIds.some(
//       (course) => String(normalizeId(course)) === String(courseId)
//     );
//   }

//   // OLD SINGLE COURSE SUPPORT
//   return String(normalizeId(tutor.courseId)) === String(courseId);
// });

//       setTutors(filtered);
//     } catch (err) {
//       showAlert(getErrorMessage(err), "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchTutors();
//   }, [courseId]);

//   const filteredTutors = useMemo(() => {
//     const q = search.toLowerCase().trim();
//     if (!q) return tutors;

//     return tutors.filter((tutor) =>
//       String(tutor.name || "").toLowerCase().includes(q)
//     );
//   }, [tutors, search]);

//   function askDeleteTutor(tutor) {
//     setDeleteTarget(tutor);
//     setConfirmOpen(true);
//     setMenuOpenId(null);
//   }

//   async function confirmDeleteTutor() {
//     if (!deleteTarget) return;

//     try {
//       await api.delete(`/admin/tuter/delete/${deleteTarget._id}`);

//       showAlert("Tutor deleted successfully", "success");
//       setConfirmOpen(false);
//       setDeleteTarget(null);
//       fetchTutors();
//     } catch (err) {
//       showAlert(getErrorMessage(err), "error");
//     }
//   }

//   async function toggleStatus(tutor) {
//     try {
//       const currentActive = isTutorActive(tutor);

//       await api.patch(`/admin/tuter/status/${tutor._id}`, {
//         isActive: !currentActive,
//       });

//       showAlert(
//         currentActive
//           ? "Tutor deactivated successfully"
//           : "Tutor activated successfully",
//         "success"
//       );

//       setMenuOpenId(null);
//       fetchTutors();
//     } catch (err) {
//       showAlert(getErrorMessage(err), "error");
//     }
//   }

//   function goToDetails(tutor, openEdit = false) {
//     navigate(`/admin/tutors/${tutor._id}`, {
//       state: {
//         backTo: `/admin/courses/${categoryId}/tutors/${courseId}`,
//         courseName,
//         openEdit,
//       },
//     });
//   }

//   return (
//     <div className="tutor-page" onClick={() => setMenuOpenId(null)}>
//       <div className="detail-breadcrumb">
//         <button type="button" onClick={() => navigate(backTo)}>
//           ← Tutors
//         </button>
//         <span>»</span>
//         <b>{courseName}</b>
//       </div>

//       <div className="tutor-toolbar" onClick={(e) => e.stopPropagation()}>
//         <div className="tutor-search">
//           <span>⌕</span>
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search tutors..."
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="tutor-state">Loading tutors...</div>
//       ) : filteredTutors.length === 0 ? (
//         <div className="tutor-state">No tutors found in this course</div>
//       ) : (
//         <div className="tutor-grid">
//           {filteredTutors.map((tutor) => {
//             const active = isTutorActive(tutor);

//             return (
//               <article
//                 key={tutor._id}
//                 className={`tutor-card ${!active ? "tutor-card--inactive" : ""}`}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {!active && <span className="inactive-badge">Inactive</span>}

//                 <div className="tutor-menu-wrap">
//                   <button
//                     className="tutor-menu-btn"
//                     type="button"
//                     onClick={() =>
//                       setMenuOpenId(menuOpenId === tutor._id ? null : tutor._id)
//                     }
//                   >
//                     ⋮
//                   </button>

//                   {menuOpenId === tutor._id && (
//                     <div className="tutor-menu">
//                       <button onClick={() => goToDetails(tutor)}>👁 View</button>
//                       <button onClick={() => goToDetails(tutor, true)}>✎ Edit</button>
//                       <button onClick={() => askDeleteTutor(tutor)}>🗑 Delete</button>
//                       <button onClick={() => toggleStatus(tutor)}>
//                         {active ? "⏻ Deactive" : "✓ Active"}
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="tutor-card-top">
//                   <div className="tutor-avatar">
//                     {tutor.photo ? (
//                       <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
//                     ) : (
//                       <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
//                     )}
//                   </div>

//                   <div>
//                     <h3>{tutor.name}</h3>
//                     <p>{tutor.qualification || "Qualification not added"}</p>
//                   </div>
//                 </div>

//                 <p className="tutor-about">
//                   {tutor.about || "No description added"}
//                 </p>

//                 <Stars rating={tutor.averageRating} />

//                 <button
//                   className="view-details-btn"
//                   onClick={() => goToDetails(tutor)}
//                 >
//                   View Details
//                 </button>
//               </article>
//             );
//           })}
//         </div>
//       )}

//       <Modal
//         open={confirmOpen}
//         title="Delete Tutor"
//         width="430px"
//         onClose={() => setConfirmOpen(false)}
//       >
//         <div className="delete-confirm-box">
//           <p>
//             <b>{deleteTarget?.name}</b> Do you want to delete this tutor?
//           </p>

//           <div className="form-actions">
//             <button className="secondary-btn" onClick={() => setConfirmOpen(false)}>
//               Cancel
//             </button>
//             <button className="danger-btn" onClick={confirmDeleteTutor}>
//               Delete
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }




































// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Modal from "../Components/Modal";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import api from "../api/axios";
// import "./AdminTutorsPage.css";
// import "./AdminTutorDetailsPage.css";

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

// function normalizeId(value) {
//   if (!value) return "";
//   return typeof value === "object" ? value._id : value;
// }

// function isTutorActive(tutor) {
//   return tutor?.isActive === true || tutor?.isActive === "true" || tutor?.isActive === 1;
// }

// function getErrorMessage(error, fallback = "Something went wrong") {
//   return (
//     error?.response?.data?.msg ||
//     error?.response?.data?.error ||
//     error?.message ||
//     fallback
//   );
// }

// function Stars({ rating = 0 }) {
//   const fixedRating = Number(rating || 0);
//   const rounded = Math.round(fixedRating);

//   return (
//     <div className="tutor-stars">
//       {[1, 2, 3, 4, 5].map((n) => (
//         <span key={n} className={n <= rounded ? "star filled" : "star"}>
//           ★
//         </span>
//       ))}
//       <b>{fixedRating.toFixed(1)}</b>
//     </div>
//   );
// }

// function getTutorShareLink(tutor) {
//   return `${window.location.origin}/student/tutors/${tutor._id}`;
// }

// async function shareTutorLink(tutor, showAlert) {
//   const tutorLink = getTutorShareLink(tutor);

//   const text = `Tutor Profile Link

// View ${tutor.name || "Tutor"} profile using the link below:

// ${tutorLink}

// Login to view full tutor details.`;

//   if (navigator.share) {
//     try {
//       await navigator.share({
//         title: `${tutor.name || "Tutor"} Profile`,
//         text,
//       });
//       return;
//     } catch (err) {
//       if (err.name === "AbortError") return;
//     }
//   }

//   try {
//     await navigator.clipboard.writeText(text);
//     showAlert("Tutor profile link copied successfully", "success");
//   } catch {
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
//     window.open(whatsappUrl, "_blank");
//   }
// }

// export default function AdminCourseTutorsPage() {
//   const { categoryId, courseId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { showAlert } = useAlert();

//   const [tutors, setTutors] = useState([]);
//   const [allTutors, setAllTutors] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [courses, setCourses] = useState([]);

//   const [search, setSearch] = useState("");
//   const [menuOpenId, setMenuOpenId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingTutor, setEditingTutor] = useState(null);
//   const [form, setForm] = useState(emptyForm);
//   const [preview, setPreview] = useState("");

//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const courseName = location.state?.courseName || "Selected Course";
//   const backTo = location.state?.backTo || `/admin/courses/${categoryId}`;

//   const selectedCategory = useMemo(() => {
//     return categories.find((cat) => cat._id === form.categoryId);
//   }, [categories, form.categoryId]);

//   const isOnlineTuition = selectedCategory?.key === "online_tuition";

//   const visibleCourses = useMemo(() => {
//     return courses.filter((course) => {
//       const courseCategoryId = normalizeId(course.categoryId);

//       if (courseCategoryId !== form.categoryId) return false;

//       if (isOnlineTuition) {
//         if (!form.sectionType) return false;

//         if (form.sectionType === "both") {
//           return course.sectionType === "one_to_one" || course.sectionType === "batch";
//         }

//         return course.sectionType === form.sectionType;
//       }

//       return true;
//     });
//   }, [courses, form.categoryId, form.sectionType, isOnlineTuition]);

//   async function fetchData() {
//     try {
//       setLoading(true);

//       const [tutorRes, catRes, courseRes] = await Promise.all([
//         api.get("/admin/tuter/all"),
//         api.get("/admin/category/all"),
//         api.get("/admin/course/all"),
//       ]);

//       const tutorList = tutorRes.data.tuters || [];

//       const filtered = tutorList.filter((tutor) => {
//         if (Array.isArray(tutor.courseIds) && tutor.courseIds.length > 0) {
//           return tutor.courseIds.some(
//             (course) => String(normalizeId(course)) === String(courseId)
//           );
//         }

//         return String(normalizeId(tutor.courseId)) === String(courseId);
//       });

//       setAllTutors(tutorList);
//       setTutors(filtered);
//       setCategories(catRes.data.categories || []);
//       setCourses(courseRes.data.courses || []);
//     } catch (err) {
//       showAlert(getErrorMessage(err), "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//   }, [courseId]);

//   const filteredTutors = useMemo(() => {
//     const q = search.toLowerCase().trim();
//     if (!q) return tutors;

//     return tutors.filter((tutor) =>
//       String(tutor.name || "").toLowerCase().includes(q)
//     );
//   }, [tutors, search]);

//   function openEditModal(tutor) {
//     const categoryIdValue = normalizeId(tutor.categoryId);

//     const categoryObj =
//       typeof tutor.categoryId === "object"
//         ? tutor.categoryId
//         : categories.find((cat) => cat._id === categoryIdValue);

//     const online = categoryObj?.key === "online_tuition";

//     const existingCourseIds =
//       Array.isArray(tutor.courseIds) && tutor.courseIds.length
//         ? tutor.courseIds.map((course) => normalizeId(course))
//         : tutor.courseId
//         ? [normalizeId(tutor.courseId)]
//         : [];

//     setEditingTutor(tutor);

//     setForm({
//       name: tutor.name || "",
//       email: tutor.email || "",
//       phone: tutor.phone || "",
//       qualification: tutor.qualification || "",
//       about: tutor.about || "",
//       subjects: Array.isArray(tutor.subjects)
//         ? tutor.subjects.join(", ")
//         : tutor.subjects || "",
//       categoryId: categoryIdValue,
//       sectionType: online ? tutor.sectionType || "" : "none",
//       syllabus: online ? tutor.syllabus || "" : "none",
//       courseIds: existingCourseIds,
//       photo: null,
//     });

//     setPreview(tutor.photo ? getMediaUrl(tutor.photo) : "");
//     setModalOpen(true);
//     setMenuOpenId(null);
//   }

//   function handleChange(e) {
//     const { name, value, files } = e.target;

//     if (name === "photo") {
//       const file = files?.[0] || null;

//       setForm((prev) => ({
//         ...prev,
//         photo: file,
//       }));

//       if (file) {
//         setPreview(URL.createObjectURL(file));
//       }

//       return;
//     }

//     if (name === "categoryId") {
//       const selectedCat = categories.find((cat) => cat._id === value);
//       const online = selectedCat?.key === "online_tuition";

//       setForm((prev) => ({
//         ...prev,
//         categoryId: value,
//         sectionType: online ? "" : "none",
//         syllabus: online ? "" : "none",
//         courseIds: [],
//       }));

//       return;
//     }

//     if (name === "sectionType") {
//       setForm((prev) => ({
//         ...prev,
//         sectionType: value,
//         courseIds: [],
//       }));

//       return;
//     }

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }

//   function toggleCourseSelection(selectedCourseId, checked) {
//     setForm((prev) => {
//       const currentCourseIds = Array.isArray(prev.courseIds) ? prev.courseIds : [];

//       return {
//         ...prev,
//         courseIds: checked
//           ? Array.from(new Set([...currentCourseIds, selectedCourseId]))
//           : currentCourseIds.filter((id) => id !== selectedCourseId),
//       };
//     });
//   }

//   async function submitTutor(e) {
//     e.preventDefault();

//     try {
//       if (!editingTutor) {
//         return showAlert("Editing tutor not found", "error");
//       }

//       if (!form.name.trim()) {
//         return showAlert("Tutor name required", "error");
//       }

//       if (!form.phone.trim()) {
//         return showAlert("Phone required", "error");
//       }

//       if (!form.categoryId) {
//         return showAlert("Category select cheyyuka", "error");
//       }

//       if (isOnlineTuition && !form.sectionType) {
//         return showAlert("One-to-One / Batch select cheyyuka", "error");
//       }

//       if (isOnlineTuition && !String(form.syllabus || "").trim()) {
//         return showAlert("Syllabus enter cheyyuka", "error");
//       }

//       if (!Array.isArray(form.courseIds) || form.courseIds.length === 0) {
//         return showAlert("At least one Course / Batch select cheyyuka", "error");
//       }

//       const finalSectionType = isOnlineTuition ? form.sectionType : "none";
//       const finalSyllabus = isOnlineTuition ? String(form.syllabus).trim() : "none";

//       const fd = new FormData();

//       fd.append("name", form.name.trim());
//       fd.append("email", form.email.trim());
//       fd.append("phone", form.phone.trim());
//       fd.append("qualification", form.qualification.trim());
//       fd.append("about", form.about.trim());
//       fd.append("subjects", form.subjects.trim());
//       fd.append("categoryId", form.categoryId);
//       fd.append("sectionType", finalSectionType);
//       fd.append("syllabus", finalSyllabus);

//       form.courseIds.forEach((selectedCourseId) => {
//         fd.append("courseIds", selectedCourseId);
//       });

//       fd.append("courseId", form.courseIds[0]);

//       if (form.photo) {
//         fd.append("photo", form.photo);
//       }

//       await api.put(`/admin/tuter/update/${editingTutor._id}`, fd);

//       showAlert("Tutor updated successfully", "success");

//       setModalOpen(false);
//       setEditingTutor(null);
//       setForm({ ...emptyForm, courseIds: [] });
//       setPreview("");
//       fetchData();
//     } catch (err) {
//       showAlert(getErrorMessage(err), "error");
//     }
//   }

//   function askDeleteTutor(tutor) {
//     setDeleteTarget(tutor);
//     setConfirmOpen(true);
//     setMenuOpenId(null);
//   }

//   async function confirmDeleteTutor() {
//     if (!deleteTarget) return;

//     try {
//       await api.delete(`/admin/tuter/delete/${deleteTarget._id}`);

//       showAlert("Tutor deleted successfully", "success");
//       setConfirmOpen(false);
//       setDeleteTarget(null);
//       fetchData();
//     } catch (err) {
//       showAlert(getErrorMessage(err), "error");
//     }
//   }

//   async function toggleStatus(tutor) {
//     try {
//       const currentActive = isTutorActive(tutor);

//       await api.patch(`/admin/tuter/status/${tutor._id}`, {
//         isActive: !currentActive,
//       });

//       showAlert(
//         currentActive
//           ? "Tutor deactivated successfully"
//           : "Tutor activated successfully",
//         "success"
//       );

//       setMenuOpenId(null);
//       fetchData();
//     } catch (err) {
//       showAlert(getErrorMessage(err), "error");
//     }
//   }

//   function goToDetails(tutor) {
//     navigate(`/admin/tutors/${tutor._id}`, {
//       state: {
//         backTo: `/admin/courses/${categoryId}/tutors/${courseId}`,
//         courseName,
//       },
//     });
//   }

//   return (
//     <div className="tutor-page" onClick={() => setMenuOpenId(null)}>
//       <div className="detail-breadcrumb">
//         <button type="button" onClick={() => navigate(backTo)}>
//           ← Tutors
//         </button>
//         <span>»</span>
//         <b>{courseName}</b>
//       </div>

//       <div className="tutor-toolbar" onClick={(e) => e.stopPropagation()}>
//         <div className="tutor-search">
//           <span>⌕</span>
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search tutors..."
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="tutor-state">Loading tutors...</div>
//       ) : filteredTutors.length === 0 ? (
//         <div className="tutor-state">No tutors found in this course</div>
//       ) : (
//         <div className="tutor-grid">
//           {filteredTutors.map((tutor) => {
//             const active = isTutorActive(tutor);

//             return (
//               <article
//                 key={tutor._id}
//                 className={`tutor-card ${!active ? "tutor-card--inactive" : ""}`}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {!active && <span className="inactive-badge">Inactive</span>}

//                 <div className="tutor-menu-wrap">
//                   <button
//                     className="tutor-menu-btn"
//                     type="button"
//                     onClick={() =>
//                       setMenuOpenId(menuOpenId === tutor._id ? null : tutor._id)
//                     }
//                   >
//                     ⋮
//                   </button>

//                   {menuOpenId === tutor._id && (
//                     <div className="tutor-menu">
//                       <button type="button" onClick={() => openEditModal(tutor)}>
//                         ✎ Edit
//                       </button>

//                       <button type="button" onClick={() => askDeleteTutor(tutor)}>
//                         🗑 Delete
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => {
//                           setMenuOpenId(null);
//                           shareTutorLink(tutor, showAlert);
//                         }}
//                       >
//                         ↗ Share
//                       </button>

//                       <button type="button" onClick={() => toggleStatus(tutor)}>
//                         {active ? "⏻ Deactive" : "✓ Active"}
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="tutor-card-top">
//                   <div className="tutor-avatar">
//                     {tutor.photo ? (
//                       <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
//                     ) : (
//                       <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
//                     )}
//                   </div>

//                   <div>
//                     <h3>{tutor.name}</h3>
//                     <p>{tutor.qualification || "Qualification not added"}</p>
//                   </div>
//                 </div>

//                 <p className="tutor-about">
//                   {tutor.about || "No description added"}
//                 </p>

//                 <Stars rating={tutor.averageRating} />

//                 <button
//                   type="button"
//                   className="view-details-btn"
//                   onClick={() => goToDetails(tutor)}
//                 >
//                   View Details
//                 </button>
//               </article>
//             );
//           })}
//         </div>
//       )}

//       <Modal
//         open={modalOpen}
//         title="Edit Tutor"
//         width="850px"
//         onClose={() => {
//           setModalOpen(false);
//           setEditingTutor(null);
//           setForm({ ...emptyForm, courseIds: [] });
//           setPreview("");
//         }}
//       >
//         <form className="tutor-form" onSubmit={submitTutor}>
//           <div className="tutor-form-grid">
//             <label className="form-field">
//               <span>Tutor Photo</span>
//               <input
//                 type="file"
//                 name="photo"
//                 accept="image/*"
//                 onChange={handleChange}
//               />
//             </label>

//             {preview && (
//               <div className="tutor-photo-preview">
//                 <img src={preview} alt="Preview" />
//               </div>
//             )}

//             <label className="form-field">
//               <span>Name</span>
//               <input name="name" value={form.name} onChange={handleChange} />
//             </label>

//             <label className="form-field">
//               <span>Email</span>
//               <input
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//               />
//             </label>

//             <label className="form-field">
//               <span>Phone</span>
//               <input name="phone" value={form.phone} onChange={handleChange} />
//             </label>

//             <label className="form-field">
//               <span>Qualification</span>
//               <input
//                 name="qualification"
//                 value={form.qualification}
//                 onChange={handleChange}
//               />
//             </label>

//             <label className="form-field form-field--full">
//               <span>About / Description</span>
//               <textarea
//                 name="about"
//                 rows="3"
//                 value={form.about}
//                 onChange={handleChange}
//               />
//             </label>

//             <label className="form-field form-field--full">
//               <span>Subject</span>
//               <input
//                 name="subjects"
//                 placeholder="Example: Mathematics, Physics"
//                 value={form.subjects}
//                 onChange={handleChange}
//               />
//             </label>

//             <label className="form-field">
//               <span>Category</span>
//               <select
//                 name="categoryId"
//                 value={form.categoryId}
//                 onChange={handleChange}
//               >
//                 <option value="">Select category</option>
//                 {categories.map((cat) => (
//                   <option key={cat._id} value={cat._id}>
//                     {cat.title}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             {isOnlineTuition && (
//               <label className="form-field">
//                 <span>Class Type</span>
//                 <select
//                   name="sectionType"
//                   value={form.sectionType}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select class type</option>
//                   <option value="one_to_one">One-to-One</option>
//                   <option value="batch">Batch</option>
//                   <option value="both">Both</option>
//                 </select>
//               </label>
//             )}

//             {isOnlineTuition && (
//               <label className="form-field">
//                 <span>Syllabus</span>
//                 <input
//                   type="text"
//                   name="syllabus"
//                   value={form.syllabus}
//                   onChange={handleChange}
//                   placeholder="Example: State, CBSE, ICSE"
//                 />
//               </label>
//             )}

//             <div className="form-field">
//               <span>
//                 {isOnlineTuition && form.sectionType === "batch"
//                   ? "Batch"
//                   : isOnlineTuition && form.sectionType === "both"
//                   ? "Courses / Batches"
//                   : "Course / Class"}
//               </span>

//               <div className="course-checkbox-list">
//                 {visibleCourses.length === 0 ? (
//                   <p className="course-empty-text">No courses found</p>
//                 ) : (
//                   visibleCourses.map((course) => {
//                     const checked = Array.isArray(form.courseIds)
//                       ? form.courseIds.includes(course._id)
//                       : false;

//                     return (
//                       <label key={course._id} className="course-check-item">
//                         <input
//                           type="checkbox"
//                           checked={checked}
//                           onChange={(e) =>
//                             toggleCourseSelection(course._id, e.target.checked)
//                           }
//                         />

//                         <span>
//                           {course.name}
//                           {isOnlineTuition && form.sectionType === "both"
//                             ? course.sectionType === "batch"
//                               ? " - Batch"
//                               : " - One-to-One"
//                             : ""}
//                         </span>
//                       </label>
//                     );
//                   })
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="form-actions">
//             <button
//               type="button"
//               className="secondary-btn"
//               onClick={() => {
//                 setModalOpen(false);
//                 setEditingTutor(null);
//                 setForm({ ...emptyForm, courseIds: [] });
//                 setPreview("");
//               }}
//             >
//               Cancel
//             </button>

//             <button type="submit" className="primary-btn">
//               Update
//             </button>
//           </div>
//         </form>
//       </Modal>

//       <Modal
//         open={confirmOpen}
//         title="Delete Tutor"
//         width="430px"
//         onClose={() => setConfirmOpen(false)}
//       >
//         <div className="delete-confirm-box">
//           <p>
//             <b>{deleteTarget?.name}</b> Do you want to delete this tutor?
//           </p>

//           <div className="form-actions">
//             <button
//               type="button"
//               className="secondary-btn"
//               onClick={() => setConfirmOpen(false)}
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               className="danger-btn"
//               onClick={confirmDeleteTutor}
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }
























































import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Modal from "../Components/Modal";
import { createPortal } from "react-dom";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import api from "../api/axios";
import "./AdminTutorsPage.css";
import "./AdminTutorDetailsPage.css";

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
  photo: null,
};

function normalizeId(value) {
  if (!value) return "";
  return typeof value === "object" ? String(value._id || "") : String(value);
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

function getCourseCategory(course, categories) {
  const categoryId = normalizeId(course?.categoryId);
  return categories.find((cat) => String(cat._id) === String(categoryId));
}

function getCourseLabel(course, categories) {
  const category = getCourseCategory(course, categories);
  const isOnline = category?.key === "online_tuition";

  if (!isOnline) return course?.name || "Course";

  if (course?.sectionType === "one_to_one") {
    return `${course.name} - One-to-One`;
  }

  if (course?.sectionType === "batch") {
    return `${course.name} - Batch`;
  }

  return course?.name || "Course";
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







// function isTutorActive(tutor) {
//   return (
//     tutor?.isActive === true ||
//     tutor?.isActive === "true" ||
//     tutor?.isActive === 1
//   );
// }






// function isTutorBlocked(tutor) {
//   return (
//     tutor?.isBlocked === true ||
//     tutor?.isBlocked === "true" ||
//     tutor?.isBlocked === 1
//   );
// }




function isTutorActive(tutor) {
  return (
    tutor?.isActive === true ||
    tutor?.isActive === "true" ||
    tutor?.isActive === 1
  );
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

// function Stars({ rating = 0 }) {
//   const fixedRating = Number(rating || 0);
//   const rounded = Math.round(fixedRating);

//   return (
//     <div className="tutor-stars">
//       {[1, 2, 3, 4, 5].map((n) => (
//         <span key={n} className={n <= rounded ? "star filled" : "star"}>
//           ★
//         </span>
//       ))}
//       <b>{fixedRating.toFixed(1)}</b>
//     </div>
//   );
// }



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

export default function AdminCourseTutorsPage() {
  const { categoryId, courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();

  const [tutors, setTutors] = useState([]);
  const [allTutors, setAllTutors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTutor, setEditingTutor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);



const menuRef = useRef(null);

useEffect(() => {
  function handleOutsideClick(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpenId(null);
    }
  }

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);





  // const courseName = location.state?.courseName || "Selected Course";
  // const backTo = location.state?.backTo || `/admin/courses/${categoryId}`;




const savedCourseData = (() => {
  try {
    return JSON.parse(
      sessionStorage.getItem(`adminCourseTutor_${courseId}`) || "{}"
    );
  } catch {
    return {};
  }
})();

const courseName =
  location.state?.courseName ||
  savedCourseData?.courseName ||
  "Selected Course";

const backTo = location.state?.backTo || `/admin/courses/${categoryId}`;

useEffect(() => {
  if (courseName && courseName !== "Selected Course") {
    sessionStorage.setItem(
      `adminCourseTutor_${courseId}`,
      JSON.stringify({ courseName })
    );
  }
}, [courseId, courseName]);








  // const selectedCategories = useMemo(() => {
  //   return categories.filter((cat) =>
  //     Array.isArray(form.categoryIds)
  //       ? form.categoryIds.map(String).includes(String(cat._id))
  //       : false
  //   );
  // }, [categories, form.categoryIds]);

  // const formHasOnlineTuition = useMemo(() => {
  //   return selectedCategories.some((cat) => cat.key === "online_tuition");
  // }, [selectedCategories]);







  // const visibleCourses = useMemo(() => {
  //   if (!Array.isArray(form.categoryIds) || form.categoryIds.length === 0) {
  //     return [];
  //   }

  //   const selectedIds = form.categoryIds.map(String);

  //   return courses.filter((course) =>
  //     selectedIds.includes(String(normalizeId(course.categoryId)))
  //   );
  // }, [courses, form.categoryIds]);







  const visibleCourses = useMemo(() => {
  return Array.isArray(courses) ? courses : [];
}, [courses]);






  // async function fetchData() {
  //   try {
  //     setLoading(true);

  //     const [tutorRes, catRes, courseRes] = await Promise.all([
  //       api.get("/admin/tuter/all"),
  //       api.get("/admin/category/all"),
  //       api.get("/admin/course/all"),
  //     ]);

  //     const tutorList = tutorRes.data.tuters || [];

  //     const filtered = tutorList.filter((tutor) => {
  //       if (Array.isArray(tutor.courseIds) && tutor.courseIds.length > 0) {
  //         return tutor.courseIds.some(
  //           (course) => String(normalizeId(course)) === String(courseId)
  //         );
  //       }

  //       return String(normalizeId(tutor.courseId)) === String(courseId);
  //     });

  //     setAllTutors(tutorList);
  //     setTutors(filtered);
  //     setCategories(catRes.data.categories || []);
  //     setCourses(courseRes.data.courses || []);
  //   } catch (err) {
  //     showAlert(getErrorMessage(err), "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // }







// async function fetchData() {
//   try {
//     setLoading(true);

//     const [tutorRes, catRes, courseRes] = await Promise.all([
//       api.get("/admin/tuter/all"),
//       api.get("/admin/category/all"),
//       api.get("/admin/course/all"),
//     ]);

//     const tutorList = tutorRes.data.tuters || [];

//     const filtered = tutorList.filter((tutor) => {
//       const active = isTutorActive(tutor);
//       const blocked = isTutorBlocked(tutor);

//       // AdminCourseTutorsPage il blocked/deactive tutors kanikkaruth
//       if (!active || blocked) {
//         return false;
//       }

//       // Multiple course support
//       if (Array.isArray(tutor.courseIds) && tutor.courseIds.length > 0) {
//         return tutor.courseIds.some(
//           (course) => String(normalizeId(course)) === String(courseId)
//         );
//       }

//       // Old single course support
//       return String(normalizeId(tutor.courseId)) === String(courseId);
//     });

//     setAllTutors(tutorList);
//     setTutors(filtered);
//     setCategories(catRes.data.categories || []);
//     setCourses(courseRes.data.courses || []);
//   } catch (err) {
//     showAlert(getErrorMessage(err), "error");
//   } finally {
//     setLoading(false);
//   }
// }










async function fetchData() {
  try {
    setLoading(true);

    const [tutorRes, catRes, courseRes] = await Promise.all([
      api.get("/admin/tuter/all"),
      api.get("/admin/category/all"),
      api.get("/admin/course/all"),
    ]);

    const tutorList = tutorRes.data.tuters || [];

    const filtered = tutorList.filter((tutor) => {
      const active = isTutorActive(tutor);
      const blocked = isTutorBlocked(tutor);

      // IMPORTANT:
      // AdminCourseTutorsPage il blocked tutors um deactive tutors um kanikkaruth
      if (!active) return false;
      if (blocked) return false;

      // Multiple course support
      if (Array.isArray(tutor.courseIds) && tutor.courseIds.length > 0) {
        return tutor.courseIds.some(
          (course) => String(normalizeId(course)) === String(courseId)
        );
      }

      // Old single course support
      return String(normalizeId(tutor.courseId)) === String(courseId);
    });

    setAllTutors(tutorList);
    setTutors(filtered);
    setCategories(catRes.data.categories || []);
    setCourses(courseRes.data.courses || []);
  } catch (err) {
    showAlert(getErrorMessage(err), "error");
  } finally {
    setLoading(false);
  }
}









// async function openTutorChat(tutor) {
//   try {
//     const tutorUserId =
//       typeof tutor?.loginUserId === "object"
//         ? tutor.loginUserId?._id
//         : tutor?.loginUserId;

//     if (!tutorUserId) {
//       return showAlert("Tutor login user id not found", "error");
//     }

//     const { data } = await api.post(`/chat/admin-tutor-room/${tutorUserId}`);

//     const roomId = data?.room?._id || data?.chatRoom?._id || data?.roomId;

//     if (roomId) {
//       navigate(`/admin/chats?roomId=${roomId}&open=chat`);
//     } else {
//       navigate("/admin/chats");
//     }
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to open tutor chat"), "error");
//   }
// }




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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const filteredTutors = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return tutors;

    return tutors.filter((tutor) =>
      String(tutor.name || "").toLowerCase().includes(q)
    );
  }, [tutors, search]);

  // function openEditModal(tutor) {
  //   const existingCategoryIds =
  //     Array.isArray(tutor.categoryIds) && tutor.categoryIds.length
  //       ? tutor.categoryIds.map((cat) => normalizeId(cat)).filter(Boolean)
  //       : tutor.categoryId
  //         ? [normalizeId(tutor.categoryId)]
  //         : [];

  //   const existingCourseIds =
  //     Array.isArray(tutor.courseIds) && tutor.courseIds.length
  //       ? tutor.courseIds.map((course) => normalizeId(course)).filter(Boolean)
  //       : tutor.courseId
  //         ? [normalizeId(tutor.courseId)]
  //         : [];

  //   const onlineSelected = existingCategoryIds.some((catId) => {
  //     const cat = categories.find((item) => String(item._id) === String(catId));
  //     return cat?.key === "online_tuition";
  //   });

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
  //     categoryIds: existingCategoryIds,
  //     syllabus: onlineSelected ? tutor.syllabus || "" : "none",
  //     courseIds: existingCourseIds,
  //     photo: null,
  //   });

  //   setPreview(tutor.photo ? getImageSrc(tutor.photo) : "");
  //   setModalOpen(true);
  //   setMenuOpenId(null);
  // }






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
    syllabus:
      tutor.syllabus &&
      tutor.syllabus !== "none" &&
      tutor.syllabus !== "Not added"
        ? tutor.syllabus
        : "",
    courseIds: existingCourseIds,
    photo: null,
  });

  setPreview(tutor.photo ? getImageSrc(tutor.photo) : "");
  setModalOpen(true);
  setMenuOpenId(null);
}






  function closeEditModal() {
    setModalOpen(false);
    setEditingTutor(null);
    setForm({ ...emptyForm, categoryIds: [], courseIds: [] });
    setPreview("");
    setSubmitting(false);
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

  // function toggleCategorySelection(categoryIdValue, checked) {
  //   setForm((prev) => {
  //     const currentCategoryIds = Array.isArray(prev.categoryIds)
  //       ? prev.categoryIds.map(String)
  //       : [];

  //     const currentCourseIds = Array.isArray(prev.courseIds)
  //       ? prev.courseIds.map(String)
  //       : [];

  //     const selectedCategoryId = String(categoryIdValue);

  //     const nextCategoryIds = checked
  //       ? Array.from(new Set([...currentCategoryIds, selectedCategoryId]))
  //       : currentCategoryIds.filter((id) => id !== selectedCategoryId);

  //     const allowedCourseIds = courses
  //       .filter((course) =>
  //         nextCategoryIds.includes(String(normalizeId(course.categoryId)))
  //       )
  //       .map((course) => String(course._id));

  //     const nextCourseIds = currentCourseIds.filter((selectedCourseId) =>
  //       allowedCourseIds.includes(String(selectedCourseId))
  //     );

  //     const hasOnlineTuition = nextCategoryIds.some((catId) => {
  //       const cat = categories.find((item) => String(item._id) === String(catId));
  //       return cat?.key === "online_tuition";
  //     });

  //     return {
  //       ...prev,
  //       categoryIds: nextCategoryIds,
  //       courseIds: nextCourseIds,
  //       syllabus: hasOnlineTuition
  //         ? prev.syllabus === "none"
  //           ? ""
  //           : prev.syllabus || ""
  //         : "none",
  //     };
  //   });
  // }

  // function toggleCourseSelection(selectedCourseId, checked) {
  //   setForm((prev) => {
  //     const currentCourseIds = Array.isArray(prev.courseIds)
  //       ? prev.courseIds.map(String)
  //       : [];

  //     const selectedCategoryIds = Array.isArray(prev.categoryIds)
  //       ? prev.categoryIds.map(String)
  //       : [];

  //     const allowedCourseIds = courses
  //       .filter((course) =>
  //         selectedCategoryIds.includes(String(normalizeId(course.categoryId)))
  //       )
  //       .map((course) => String(course._id));

  //     const normalizedCourseId = String(selectedCourseId);

  //     let nextCourseIds = checked
  //       ? Array.from(new Set([...currentCourseIds, normalizedCourseId]))
  //       : currentCourseIds.filter((id) => id !== normalizedCourseId);

  //     nextCourseIds = nextCourseIds.filter((id) => allowedCourseIds.includes(id));

  //     return {
  //       ...prev,
  //       courseIds: nextCourseIds,
  //     };
  //   });
  // }





function toggleCourseSelection(selectedCourseId, checked) {
  setForm((prev) => {
    const currentCourseIds = Array.isArray(prev.courseIds)
      ? prev.courseIds.map(String)
      : [];

    const normalizedCourseId = String(selectedCourseId);

    const nextCourseIds = checked
      ? Array.from(new Set([...currentCourseIds, normalizedCourseId]))
      : currentCourseIds.filter((id) => id !== normalizedCourseId);

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








  // async function submitTutor(e) {
  //   e.preventDefault();

  //   try {
  //     if (!editingTutor) {
  //       return showAlert("Editing tutor not found", "error");
  //     }

  //     if (!form.name.trim()) {
  //       return showAlert("Tutor name required", "error");
  //     }

  //     if (!form.phone.trim()) {
  //       return showAlert("Phone required", "error");
  //     }

  //     if (!Array.isArray(form.categoryIds) || form.categoryIds.length === 0) {
  //       return showAlert("At least one category select cheyyuka", "error");
  //     }

  //     if (formHasOnlineTuition && !String(form.syllabus || "").trim()) {
  //       return showAlert("Syllabus enter cheyyuka", "error");
  //     }

  //     if (!Array.isArray(form.courseIds) || form.courseIds.length === 0) {
  //       return showAlert("At least one Course / Class select cheyyuka", "error");
  //     }

  //     setSubmitting(true);

  //     const fd = new FormData();

  //     fd.append("name", form.name.trim());
  //     fd.append("email", form.email.trim());
  //     fd.append("phone", form.phone.trim());
  //     fd.append("qualification", form.qualification.trim());
  //     fd.append("about", form.about.trim());
  //     fd.append("subjects", form.subjects.trim());

  //     form.categoryIds.forEach((selectedCategoryId) => {
  //       fd.append("categoryIds", selectedCategoryId);
  //     });

  //     fd.append("categoryId", form.categoryIds[0]);

  //     form.courseIds.forEach((selectedCourseId) => {
  //       fd.append("courseIds", selectedCourseId);
  //     });

  //     fd.append("courseId", form.courseIds[0]);
  //     fd.append("sectionType", formHasOnlineTuition ? "both" : "none");
  //     fd.append(
  //       "syllabus",
  //       formHasOnlineTuition ? String(form.syllabus).trim() : "none"
  //     );

  //     if (form.photo) {
  //       fd.append("photo", form.photo);
  //     }

  //     await api.put(`/admin/tuter/update/${editingTutor._id}`, fd);

  //     showAlert("Tutor updated successfully", "success");
  //     closeEditModal();
  //     fetchData();
  //   } catch (err) {
  //     showAlert(getErrorMessage(err), "error");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // }





async function submitTutor(e) {
  e.preventDefault();

  try {
    if (!editingTutor) {
      return showAlert("Editing tutor not found", "error");
    }

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

    autoCategoryIds.forEach((selectedCategoryId) => {
      fd.append("categoryIds", selectedCategoryId);
    });

    fd.append("categoryId", autoCategoryIds[0]);

    form.courseIds.forEach((selectedCourseId) => {
      fd.append("courseIds", selectedCourseId);
    });

    fd.append("courseId", form.courseIds[0]);
    fd.append("sectionType", finalSectionType);
    fd.append("syllabus", finalSyllabus);

    if (form.photo) {
      fd.append("photo", form.photo);
    }

    await api.put(`/admin/tuter/update/${editingTutor._id}`, fd);

    showAlert("Tutor updated successfully", "success");
    closeEditModal();
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
    if (!deleteTarget) return;

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

  // async function toggleStatus(tutor) {
  //   try {
  //     const currentActive = isTutorActive(tutor);

  //     await api.patch(`/admin/tuter/status/${tutor._id}`, {
  //       isActive: !currentActive,
  //     });

  //     showAlert(
  //       currentActive
  //         ? "Tutor deactivated successfully"
  //         : "Tutor activated successfully",
  //       "success"
  //     );

  //     setMenuOpenId(null);
  //     fetchData();
  //   } catch (err) {
  //     showAlert(getErrorMessage(err), "error");
  //   }
  // }







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

    setAllTutors((prev) =>
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

//     setAllTutors((prev) =>
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
//       nextBlocked ? "Tutor blocked successfully" : "Tutor unblocked successfully",
//       "success"
//     );
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to update block status"), "error");
//   }
// }







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

    setAllTutors((prev) =>
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









  // function goToDetails(tutor) {
  //   navigate(`/admin/tutors/${tutor._id}`, {
  //     state: {
  //       backTo: `/admin/courses/${categoryId}/tutors/${courseId}`,
  //       courseName,
  //     },
  //   });
  // }





// function goToDetails(tutor) {
//   navigate(`/admin/tutors/${tutor._id}`, {
//     state: {
//       backTo: `/admin/courses/${categoryId}/tutors/${courseId}`,
//       backLabel: "View details",
//       courseName,
//     },
//   });
// }








// function goToDetails(tutor, openEdit = false) {
//   const backData = {
//     backTo: `/admin/courses/${categoryId}/tutors/${courseId}`,
//     backButtonLabel: "Tutors",
//     backLabel: "View details",
//     courseName: courseName || "Selected Course",
//     openEdit,
//   };

//   sessionStorage.setItem("adminTutorBackData", JSON.stringify(backData));

//   sessionStorage.setItem(
//     `adminCourseTutor_${courseId}`,
//     JSON.stringify({ courseName: courseName || "Selected Course" })
//   );

//   navigate(`/admin/tutors/${tutor._id}`, {
//     state: backData,
//   });
// }






function goToDetails(tutor, openEdit = false) {
  const cleanCourseName = courseName || "Selected Course";

  const backData = {
    backTo: `/admin/courses/${categoryId}/tutors/${courseId}`,
    backButtonLabel: `${cleanCourseName} tutors`,
    backLabel: "View details",
    courseName: cleanCourseName,
    openEdit,
  };

  sessionStorage.setItem("adminTutorBackData", JSON.stringify(backData));

  sessionStorage.setItem(
    `adminCourseTutor_${courseId}`,
    JSON.stringify({ courseName: cleanCourseName })
  );

  navigate(`/admin/tutors/${tutor._id}`, {
    state: backData,
  });
}







// const backTo = location.state?.backTo || "/admin/tutors";
// const backLabel = location.state?.courseName || "View details";





  return (
    <div className="tutor-page" onClick={() => setMenuOpenId(null)}>
      {/* <div className="detail-breadcrumb">
        <button type="button" onClick={() => navigate(backTo)}>
          ← Tutors
        </button>
        <span>»</span>
        <b>{courseName}</b>
      </div> */}






{/* 
<div className="detail-breadcrumb">
  <button type="button" onClick={() => navigate(backTo)}>
    ← Courses
  </button>
  <span>»</span>
  <b>{courseName} tutors</b>
</div>






      <div className="tutor-toolbar" onClick={(e) => e.stopPropagation()}>
        <div className="tutor-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutors..."
          />
        </div>
      </div> */}






<div className="detail-breadcrumb">
  <button type="button" onClick={() => navigate(backTo)}>
    ← Courses
  </button>
  <span>»</span>
  <b>Tutors</b>
</div>

<div className="course-tutors-page-head">
  <h2>{courseName} tutors</h2>
</div>

<div className="tutor-toolbar" onClick={(e) => e.stopPropagation()}>
  <div className="tutor-search">
    <span>⌕</span>
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search tutors..."
    />
  </div>
</div>







      {loading ? (
        <div className="tutor-state">Loading tutors...</div>
      ) : filteredTutors.length === 0 ? (
        <div className="tutor-state">No tutors found in this course</div>
      ) : (
        <div className="tutor-grid">
          {filteredTutors.map((tutor) => {
            const active = isTutorActive(tutor);

            return (
              <article
                key={tutor._id}
                // className={`tutor-card ${!active ? "tutor-card--inactive" : ""}`}


className={`tutor-card ${
  isTutorBlocked(tutor)
    ? "tutor-card--blocked"
    : !active
    ? "tutor-card--inactive"
    : ""
}`}


                onClick={(e) => e.stopPropagation()}
              >
                {/* {!active && <span className="inactive-badge">Inactive</span>} */}


{isTutorBlocked(tutor) ? (
  <span className="blocked-badge">Blocked</span>
) : !active ? (
  <span className="inactive-badge">Inactive</span>
) : null}




                {/* <div className="tutor-menu-wrap">
                  <button
                    className="tutor-menu-btn"
                    type="button"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === tutor._id ? null : tutor._id)
                    }
                  >
                    ⋮
                  </button> */}









                  <div
  className="tutor-menu-wrap"
  ref={menuOpenId === tutor._id ? menuRef : null}
  onMouseDown={(e) => e.stopPropagation()}
>
  <button
    className="tutor-menu-btn"
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      setMenuOpenId((prev) => (prev === tutor._id ? null : tutor._id));
    }}
  >
    ⋮
  </button>

                  {menuOpenId === tutor._id && (
                    // <div className="tutor-menu">
                    //   <button type="button" onClick={() => openEditModal(tutor)}>
                    //     ✎ Edit
                    //   </button>

                    //   <button type="button" onClick={() => askDeleteTutor(tutor)}>
                    //     🗑 Delete
                    //   </button>

                    //   <button
                    //     type="button"
                    //     onClick={() => {
                    //       setMenuOpenId(null);
                    //       shareTutorLink(tutor, showAlert);
                    //     }}
                    //   >
                    //     ↗ Share
                    //   </button>

                    //   <button type="button" onClick={() => toggleStatus(tutor)}>
                    //     {active ? "⏻ Deactive" : "✓ Active"}
                    //   </button>
                    // </div>





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

  {/* <button type="button" onClick={() => toggleStatus(tutor)}>
    {active ? "⏻ Deactive" : "✓ Active"}
  </button> */}




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










{/* <button type="button" onClick={() => toggleTutorStatus(tutor)}>
  {isTutorActive(tutor) ? "⏻ Deactive" : "✓ Active"}
</button> */}


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
                      <img src={getImageSrc(tutor.photo)} alt={tutor.name} />
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

                {/* <button
                  type="button"
                  className="view-details-btn"
                  onClick={() => goToDetails(tutor)}
                >
                  View Details
                </button> */}



<div className="tutor-card-actions">
  {/* <button
    type="button"
    className="tutor-chat-btn"
    onClick={() => openTutorChat(tutor)}
  >
    Chat
  </button> */}





{/* <button
  type="button"
  className={`tutor-chat-btn ${
    isTutorBlocked(tutor) ? "tutor-chat-btn--disabled" : ""
  }`}
  disabled={isTutorBlocked(tutor)}
  onClick={() => openTutorChat(tutor)}
>
  Chat
</button> */}






<button
  type="button"
  className={`tutor-chat-btn ${
    isTutorBlocked(tutor) ? "tutor-chat-btn--disabled" : ""
  }`}
  disabled={isTutorBlocked(tutor)}
  onClick={(e) => {
    e.stopPropagation();

    if (isTutorBlocked(tutor)) {
      showAlert("Blocked tutor chat is disabled", "error");
      return;
    }

    openTutorChat(tutor);
  }}
>
  Chat
</button>







  <button
    type="button"
    className="view-details-btn"
    onClick={() => goToDetails(tutor)}
  >
    View Details
  </button>
</div>





                
              </article>
            );
          })}
        </div>
      )}

      {/* <Modal open={modalOpen} title="Edit Tutor" width="850px" onClose={closeEditModal}> */}
      <TutorDarkModal
  open={modalOpen}
  title="Edit Tutor"
  width="820px"
  onClose={closeEditModal}
>
        <form className="detail-form tutor-form" onSubmit={submitTutor}>
          <div className="detail-form-grid tutor-form-grid">
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
              <div className="detail-photo-preview tutor-photo-preview">
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

            {/* <div className="form-field form-field--full">
              <span>Categories</span>

              <div className="course-checkbox-list tutor-category-checkbox-list">
                {categories.length === 0 ? (
                  <p className="course-empty-text">No categories found</p>
                ) : (
                  categories.map((cat) => {
                    const checked = Array.isArray(form.categoryIds)
                      ? form.categoryIds.map(String).includes(String(cat._id))
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
            </div> */}

            {/* {formHasOnlineTuition && (
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
            )} */}





<label className="form-field form-field--full">
  <span>Syllabus</span>
  <input
    type="text"
    name="syllabus"
    value={form.syllabus}
    onChange={handleChange}
    placeholder="Example: State, CBSE, ICSE"
  />
  {/* <small className="tutor-syllabus-note">
    Empty aakki save cheythal “Not added” aayi save aavum.
  </small> */}
</label>





            {/* <div className="form-field form-field--full">
              <span>Courses / Classes</span>

              <div className="course-checkbox-list tutor-course-checkbox-list">
                {visibleCourses.length === 0 ? (
                  <p className="course-empty-text">No courses found</p>
                ) : (
                  visibleCourses.map((course) => {
                    const checked = Array.isArray(form.courseIds)
                      ? form.courseIds.map(String).includes(String(course._id))
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
            </div> */}



<div className="form-field form-field--full">
  <span>Courses / Classes</span>

  <div className="course-checkbox-list tutor-course-checkbox-list">
    {visibleCourses.length === 0 ? (
      <p className="course-empty-text">No courses found</p>
    ) : (
      visibleCourses.map((course) => {
        const checked = Array.isArray(form.courseIds)
          ? form.courseIds.map(String).includes(String(course._id))
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

          {/* <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={closeEditModal}
              disabled={submitting}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div> */}





<div className="form-actions">
  <button
    type="button"
    className="secondary-btn"
    onClick={closeEditModal}
    disabled={submitting}
  >
    Cancel
  </button>

  <button
    type="submit"
    className="primary-btn"
    disabled={submitting}
  >
    {submitting ? "Updating..." : "Update"}
  </button>
</div>






        </form>
      </TutorDarkModal>

      {/* <Modal
        open={confirmOpen}
        title="Delete Tutor"
        width="420px"
        onClose={() => {
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
      >
        <div className="delete-confirm-box">
          <p>
            Are you sure you want to delete{" "}
            <b>{deleteTarget?.name || "this tutor"}</b>?
          </p>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setConfirmOpen(false);
                setDeleteTarget(null);
              }}
              disabled={submitting}
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
      </Modal> */}







<TutorDarkModal
  open={confirmOpen}
  title="Delete Tutor"
  width="430px"
  onClose={() => {
    if (!submitting) setConfirmOpen(false);
  }}
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
        disabled={submitting}
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