
// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Modal from "../Components/Modal";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import api from "../api/axios";
// import "./AdminTutorDetailsPage.css";

// // const emptyForm = {
// //   name: "",
// //   email: "",
// //   phone: "",
// //   qualification: "",
// //   about: "",
// //   subjects: "",
// //   categoryId: "",
// //   sectionType: "",
// //   syllabus: "",
// //   courseIds: [],
// //   photo: null,
// // };







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




// function normalizeId(value) {
//   if (!value) return "";
//   return typeof value === "object" ? value._id : value;
// }


// // function getCourseCategory(course, categories) {
// //   const courseCategoryId = normalizeId(course.categoryId);
// //   return categories.find((cat) => cat._id === courseCategoryId);
// // }

// // function getCourseLabel(course, categories) {
// //   const category = getCourseCategory(course, categories);
// //   const isOnline = category?.key === "online_tuition";

// //   if (!isOnline) return course.name;

// //   if (course.sectionType === "one_to_one") {
// //     return `${course.name} - One-to-One`;
// //   }

// //   if (course.sectionType === "batch") {
// //     return `${course.name} - Batch`;
// //   }

// //   return course.name;
// // }









// function getCourseCategory(course, categories) {
//   const categoryId = normalizeId(course?.categoryId);

//   return categories.find(
//     (cat) => String(cat._id) === String(categoryId)
//   );
// }

// function getCourseLabel(course, categories) {
//   const category = getCourseCategory(course, categories);
//   const isOnline = category?.key === "online_tuition";

//   if (!isOnline) return course?.name || "Course";

//   if (course?.sectionType === "one_to_one") {
//     return `${course.name} - One-to-One`;
//   }

//   if (course?.sectionType === "batch") {
//     return `${course.name} - Batch`;
//   }

//   return course?.name || "Course";
// }








// function getName(value) {
//   if (!value) return "";
//   return typeof value === "object" ? value.name || value.title || "" : "";
// }

// function getCourseNames(tutor) {
//   if (Array.isArray(tutor?.courseIds) && tutor.courseIds.length > 0) {
//     const names = tutor.courseIds
//       .map((course) => getName(course))
//       .filter(Boolean);

//     if (names.length > 0) return names.join(", ");
//   }

//   return getName(tutor?.courseId);
// }

// function getImageSrc(value) {
//   if (!value) return "";

//   const src = String(value).trim();

//   if (
//     src.startsWith("data:image") ||
//     src.startsWith("blob:") ||
//     src.startsWith("http://") ||
//     src.startsWith("https://")
//   ) {
//     return src;
//   }

//   return getMediaUrl(src);
// }

// function getStudentName(review) {
//   return review?.studentId?.name || review?.studentName || "Student";
// }

// function getStudentPhoto(review) {
//   return review?.studentId?.photo || review?.studentPhoto || review?.photo || "";
// }

// function isTutorActive(tutor) {
//   return (
//     tutor?.isActive === true ||
//     tutor?.isActive === "true" ||
//     tutor?.isActive === 1
//   );
// }

// function formatSyllabus(value) {
//   if (!value || value === "none") return "Not added";

//   const text = String(value).trim();
//   if (!text) return "Not added";

//   if (text.toLowerCase() === "state") return "State";
//   if (text.toLowerCase() === "cbse") return "CBSE";
//   if (text.toLowerCase() === "icse") return "ICSE";

//   return text;
// }

// function getErrorMessage(error, fallback = "Something went wrong") {
//   return (
//     error?.response?.data?.msg ||
//     error?.response?.data?.error ||
//     error?.message ||
//     fallback
//   );
// }

// function Stars({ rating = 0, compact = false }) {
//   const fixedRating = Number(rating || 0);
//   const rounded = Math.round(fixedRating);

//   return (
//     <div className={compact ? "detail-stars detail-stars--compact" : "detail-stars"}>
//       {[1, 2, 3, 4, 5].map((n) => (
//         <span
//           key={n}
//           className={n <= rounded ? "detail-star filled" : "detail-star"}
//         >
//           ★
//         </span>
//       ))}
//       {!compact && <b>{fixedRating.toFixed(1)}</b>}
//     </div>
//   );
// }

// function getTutorShareText(tutor) {
//   const subjects = Array.isArray(tutor.subjects)
//     ? tutor.subjects.join(", ")
//     : tutor.subjects || "Not added";

//   return `Tutor Details

// Name: ${tutor.name || "Not added"}
// Qualification: ${tutor.qualification || "Not added"}
// Phone: ${tutor.phone || "Not added"}
// Email: ${tutor.email || "Not added"}
// Course / Class: ${getCourseNames(tutor) || "Not added"}
// Syllabus: ${formatSyllabus(tutor.syllabus)}
// Subjects: ${subjects}
// About: ${tutor.about || "Not added"}
// Rating: ${Number(tutor.averageRating || 0).toFixed(1)}`;
// }

// function getTutorShareLink(tutor) {
//   return `${window.location.origin}/student/tutors/${tutor._id}`;
// }

// async function shareTutorDetails(tutor, showAlert) {
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

// function ReviewCard({ review }) {
//   const photo = getStudentPhoto(review);
//   const photoSrc = getImageSrc(photo);
//   const name = getStudentName(review);
//   const [imageError, setImageError] = useState(false);

//   return (
//     <div className="review-card">
//       <div className="review-card__left">
//         <div className="review-avatar">
//           {photoSrc && !imageError ? (
//             <img
//               src={photoSrc}
//               alt={name}
//               onError={() => setImageError(true)}
//             />
//           ) : (
//             <span>{name.charAt(0).toUpperCase()}</span>
//           )}
//         </div>

//         <div>
//           <h4>{name}</h4>
//           <p>{review.review || review.comment || "No review text added."}</p>
//         </div>
//       </div>

//       <Stars rating={review.rating} compact />
//     </div>
//   );
// }

// export default function AdminTutorDetailsPage() {
//   const { tuterId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { showAlert } = useAlert();

//   const backTo = location.state?.backTo || "/admin/tutors";

//   const [tutor, setTutor] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [reviewsOpen, setReviewsOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);


// const [assignedStudentsOpen, setAssignedStudentsOpen] = useState(false);
// const [assignedStudents, setAssignedStudents] = useState([]);
// const [assignedStudentsLoading, setAssignedStudentsLoading] = useState(false);


//   const [form, setForm] = useState(emptyForm);
//   const [preview, setPreview] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   // const selectedCategory = useMemo(
//   //   () => categories.find((c) => c._id === form.categoryId),
//   //   [categories, form.categoryId]
//   // );

//   // const visibleCourses = useMemo(() => {
//   //   return courses.filter((course) => {
//   //     const courseCategoryId = normalizeId(course.categoryId);

//   //     if (courseCategoryId !== form.categoryId) return false;

//   //     if (selectedCategory?.key === "online_tuition") {
//   //       if (!form.sectionType) return false;

//   //       if (form.sectionType === "both") {
//   //         return (
//   //           course.sectionType === "one_to_one" ||
//   //           course.sectionType === "batch"
//   //         );
//   //       }

//   //       return course.sectionType === form.sectionType;
//   //     }

//   //     return true;
//   //   });
//   // }, [courses, form.categoryId, form.sectionType, selectedCategory]);








// const selectedCategories = useMemo(() => {
//   return categories.filter((cat) =>
//     form.categoryIds.includes(cat._id)
//   );
// }, [categories, form.categoryIds]);

// const isOnlineTuition = useMemo(() => {
//   return selectedCategories.some(
//     (cat) => cat.key === "online_tuition"
//   );
// }, [selectedCategories]);

// const visibleCourses = useMemo(() => {
//   if (!Array.isArray(form.categoryIds) || form.categoryIds.length === 0) {
//     return [];
//   }

//   return courses.filter((course) => {
//     const courseCategoryId = normalizeId(course.categoryId);
//     return form.categoryIds.includes(courseCategoryId);
//   });
// }, [courses, form.categoryIds]);






//   const subjects = useMemo(() => {
//     if (!tutor?.subjects) return [];

//     return Array.isArray(tutor.subjects)
//       ? tutor.subjects
//       : String(tutor.subjects)
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean);
//   }, [tutor]);

//   const recentReviews = useMemo(() => {
//     return Array.isArray(tutor?.reviews) ? tutor.reviews.slice(0, 2) : [];
//   }, [tutor]);

//   async function fetchData() {
//     try {
//       setLoading(true);

//       const [tutorRes, catRes, courseRes] = await Promise.all([
//         api.get(`/tuter/${tuterId}`),
//         api.get("/admin/category/all"),
//         api.get("/admin/course/all"),
//       ]);

//       setTutor(tutorRes.data.tuter || null);
//       setCategories(catRes.data.categories || []);
//       setCourses(courseRes.data.courses || []);
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to load tutor details"), "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tuterId]);

//   // function openEditModal() {
//   //   if (!tutor) return;

//   //   const categoryId = normalizeId(tutor.categoryId);

//   //   const categoryObj =
//   //     typeof tutor.categoryId === "object"
//   //       ? tutor.categoryId
//   //       : categories.find((cat) => cat._id === categoryId);

//   //   const isOnlineTuition = categoryObj?.key === "online_tuition";

//   //   const existingCourseIds =
//   //     Array.isArray(tutor.courseIds) && tutor.courseIds.length > 0
//   //       ? tutor.courseIds.map((course) => normalizeId(course)).filter(Boolean)
//   //       : tutor.courseId
//   //       ? [normalizeId(tutor.courseId)]
//   //       : [];

//   //   setForm({
//   //     name: tutor.name || "",
//   //     email: tutor.email || "",
//   //     phone: tutor.phone || "",
//   //     qualification: tutor.qualification || "",
//   //     about: tutor.about || "",
//   //     subjects: Array.isArray(tutor.subjects)
//   //       ? tutor.subjects.join(", ")
//   //       : tutor.subjects || "",
//   //     categoryId,
//   //     sectionType: isOnlineTuition ? tutor.sectionType || "" : "none",
//   //     syllabus: isOnlineTuition ? tutor.syllabus || "" : "none",
//   //     courseIds: existingCourseIds,
//   //     photo: null,
//   //   });

//   //   setPreview(tutor.photo ? getImageSrc(tutor.photo) : "");
//   //   setEditOpen(true);
//   // }







// function openEditModal() {
//   if (!tutor) return;

//   const existingCategoryIds =
//     Array.isArray(tutor.categoryIds) && tutor.categoryIds.length
//       ? tutor.categoryIds.map((cat) => normalizeId(cat))
//       : tutor.categoryId
//       ? [normalizeId(tutor.categoryId)]
//       : [];

//   const existingCourseIds =
//     Array.isArray(tutor.courseIds) && tutor.courseIds.length
//       ? tutor.courseIds.map((course) => normalizeId(course))
//       : tutor.courseId
//       ? [normalizeId(tutor.courseId)]
//       : [];

//   const onlineSelected = existingCategoryIds.some((catId) => {
//     const cat = categories.find(
//       (item) => String(item._id) === String(catId)
//     );
//     return cat?.key === "online_tuition";
//   });

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
//   setEditOpen(true);
// }









//   useEffect(() => {
//     if (!loading && tutor && location.state?.openEdit && !editOpen) {
//       openEditModal();

//       navigate(location.pathname, {
//         replace: true,
//         state: {},
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [loading, tutor?._id, location.state?.openEdit, editOpen]);








//   // function handleChange(e) {
//   //   const { name, value, files } = e.target;

//   //   if (name === "photo") {
//   //     const file = files?.[0] || null;

//   //     setForm((prev) => ({
//   //       ...prev,
//   //       photo: file,
//   //     }));

//   //     if (file) {
//   //       setPreview(URL.createObjectURL(file));
//   //     }

//   //     return;
//   //   }

//   //   if (name === "categoryId") {
//   //     const selectedCat = categories.find((cat) => cat._id === value);
//   //     const isOnline = selectedCat?.key === "online_tuition";

//   //     setForm((prev) => ({
//   //       ...prev,
//   //       categoryId: value,
//   //       sectionType: isOnline ? "" : "none",
//   //       syllabus: isOnline ? "" : "none",
//   //       courseIds: [],
//   //     }));

//   //     return;
//   //   }

//   //   if (name === "sectionType") {
//   //     setForm((prev) => ({
//   //       ...prev,
//   //       sectionType: value,
//   //       courseIds: [],
//   //     }));

//   //     return;
//   //   }

//   //   setForm((prev) => ({
//   //     ...prev,
//   //     [name]: value,
//   //   }));
//   // }

//   // function toggleCourseSelection(courseId, checked) {
//   //   setForm((prev) => {
//   //     const currentCourseIds = Array.isArray(prev.courseIds)
//   //       ? prev.courseIds
//   //       : [];

//   //     return {
//   //       ...prev,
//   //       courseIds: checked
//   //         ? Array.from(new Set([...currentCourseIds, courseId]))
//   //         : currentCourseIds.filter((id) => id !== courseId),
//   //     };
//   //   });
//   // }





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

//   setForm((prev) => ({
//     ...prev,
//     [name]: value,
//   }));
// }

// function toggleCategorySelection(categoryId, checked) {
//   setForm((prev) => {
//     const currentCategoryIds = Array.isArray(prev.categoryIds)
//       ? prev.categoryIds.map(String)
//       : [];

//     const currentCourseIds = Array.isArray(prev.courseIds)
//       ? prev.courseIds.map(String)
//       : [];

//     const selectedCategoryId = String(categoryId);

//     const nextCategoryIds = checked
//       ? Array.from(new Set([...currentCategoryIds, selectedCategoryId]))
//       : currentCategoryIds.filter((id) => id !== selectedCategoryId);

//     const allowedCourseIds = courses
//       .filter((course) =>
//         nextCategoryIds.includes(String(normalizeId(course.categoryId)))
//       )
//       .map((course) => String(course._id));

//     const nextCourseIds = currentCourseIds.filter((courseId) =>
//       allowedCourseIds.includes(String(courseId))
//     );

//     const hasOnlineTuition = nextCategoryIds.some((catId) => {
//       const cat = categories.find(
//         (item) => String(item._id) === String(catId)
//       );
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

// function toggleCourseSelection(courseId, checked) {
//   setForm((prev) => {
//     const currentCourseIds = Array.isArray(prev.courseIds)
//       ? prev.courseIds.map(String)
//       : [];

//     const normalizedCourseId = String(courseId);

//     const allowedCourseIds = courses
//       .filter((course) =>
//         prev.categoryIds.includes(String(normalizeId(course.categoryId)))
//       )
//       .map((course) => String(course._id));

//     let nextCourseIds = checked
//       ? Array.from(new Set([...currentCourseIds, normalizedCourseId]))
//       : currentCourseIds.filter((id) => id !== normalizedCourseId);

//     nextCourseIds = nextCourseIds.filter((id) =>
//       allowedCourseIds.includes(id)
//     );

//     return {
//       ...prev,
//       courseIds: nextCourseIds,
//     };
//   });
// }







//   // async function updateTutor(e) {
//   //   e.preventDefault();

//   //   try {
//   //     if (!form.name.trim()) {
//   //       return showAlert("Tutor name required", "error");
//   //     }

//   //     if (!form.phone.trim()) {
//   //       return showAlert("Phone required", "error");
//   //     }

//   //     if (!form.categoryId) {
//   //       return showAlert("Category select cheyyuka", "error");
//   //     }

//   //     if (selectedCategory?.key === "online_tuition" && !form.sectionType) {
//   //       return showAlert("One-to-One / Batch select cheyyuka", "error");
//   //     }

//   //     if (
//   //       selectedCategory?.key === "online_tuition" &&
//   //       !String(form.syllabus || "").trim()
//   //     ) {
//   //       return showAlert("Syllabus select cheyyuka", "error");
//   //     }

//   //     if (!Array.isArray(form.courseIds) || form.courseIds.length === 0) {
//   //       return showAlert("At least one Course / Batch select cheyyuka", "error");
//   //     }

//   //     setSubmitting(true);

//   //     const finalSectionType =
//   //       selectedCategory?.key === "online_tuition" ? form.sectionType : "none";

//   //     const finalSyllabus =
//   //       selectedCategory?.key === "online_tuition"
//   //         ? String(form.syllabus).trim()
//   //         : "none";

//   //     const fd = new FormData();

//   //     fd.append("name", form.name.trim());
//   //     fd.append("email", form.email.trim());
//   //     fd.append("phone", form.phone.trim());
//   //     fd.append("qualification", form.qualification.trim());
//   //     fd.append("about", form.about.trim());
//   //     fd.append("subjects", form.subjects.trim());
//   //     fd.append("categoryId", form.categoryId);
//   //     fd.append("courseId", form.courseIds[0]);

//   //     form.courseIds.forEach((courseId) => {
//   //       fd.append("courseIds", courseId);
//   //     });

//   //     fd.append("sectionType", finalSectionType);
//   //     fd.append("syllabus", finalSyllabus);

//   //     if (form.photo) {
//   //       fd.append("photo", form.photo);
//   //     }

//   //     await api.put(`/admin/tuter/update/${tuterId}`, fd);

//   //     showAlert("Tutor updated successfully", "success");
//   //     setEditOpen(false);
//   //     fetchData();
//   //   } catch (err) {
//   //     showAlert(getErrorMessage(err), "error");
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // }





// async function updateTutor(e) {
//   e.preventDefault();

//   try {
//     if (!form.name.trim()) {
//       return showAlert("Tutor name required", "error");
//     }

//     if (!form.phone.trim()) {
//       return showAlert("Phone required", "error");
//     }

//     if (!Array.isArray(form.categoryIds) || form.categoryIds.length === 0) {
//       return showAlert("At least one category select cheyyuka", "error");
//     }

//     if (isOnlineTuition && !String(form.syllabus || "").trim()) {
//       return showAlert("Syllabus enter cheyyuka", "error");
//     }

//     if (!Array.isArray(form.courseIds) || form.courseIds.length === 0) {
//       return showAlert("At least one Course / Class select cheyyuka", "error");
//     }

//     setSubmitting(true);

//     const finalSyllabus = isOnlineTuition
//       ? String(form.syllabus).trim()
//       : "none";

//     const finalSectionType = isOnlineTuition ? "both" : "none";

//     const fd = new FormData();

//     fd.append("name", form.name.trim());
//     fd.append("email", form.email.trim());
//     fd.append("phone", form.phone.trim());
//     fd.append("qualification", form.qualification.trim());
//     fd.append("about", form.about.trim());
//     fd.append("subjects", form.subjects.trim());

//     form.categoryIds.forEach((categoryId) => {
//       fd.append("categoryIds", categoryId);
//     });

//     fd.append("categoryId", form.categoryIds[0]);

//     form.courseIds.forEach((courseId) => {
//       fd.append("courseIds", courseId);
//     });

//     fd.append("courseId", form.courseIds[0]);
//     fd.append("sectionType", finalSectionType);
//     fd.append("syllabus", finalSyllabus);

//     if (form.photo) {
//       fd.append("photo", form.photo);
//     }

//     await api.put(`/admin/tuter/update/${tuterId}`, fd);

//     showAlert("Tutor updated successfully", "success");
//     setEditOpen(false);
//     fetchData();
//   } catch (err) {
//     showAlert(getErrorMessage(err), "error");
//   } finally {
//     setSubmitting(false);
//   }
// }








//   async function deleteTutor() {
//     try {
//       setSubmitting(true);

//       await api.delete(`/admin/tuter/delete/${tuterId}`);

//       showAlert("Tutor deleted successfully", "success");
//       setDeleteOpen(false);
//       navigate(backTo);
//     } catch (err) {
//       showAlert(getErrorMessage(err), "error");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   function contactTutor() {
//     const phone = String(tutor?.phone || "").replace(/\D/g, "");

//     if (!phone) {
//       showAlert("Tutor phone number not added", "error");
//       return;
//     }

//     window.open(`tel:${phone}`, "_self");
//   }


// async function openAssignedStudentsModal() {
//   try {
//     setAssignedStudentsOpen(true);
//     setAssignedStudentsLoading(true);

//     const { data } = await api.get(
//       `/admin/tuter/${tuterId}/assigned-students`
//     );

//     setAssignedStudents(data.students || []);
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to load assigned students"), "error");
//   } finally {
//     setAssignedStudentsLoading(false);
//   }
// }



//   if (loading) {
//     return (
//       <div className="tutor-detail-page">
//         <div className="detail-state">Loading tutor details...</div>
//       </div>
//     );
//   }

//   if (!tutor) {
//     return (
//       <div className="tutor-detail-page">
//         <div className="detail-state">Tutor not found</div>
//       </div>
//     );
//   }

//   const active = isTutorActive(tutor);
//   const isOnlineTuition = tutor?.categoryId?.key === "online_tuition";
//   const tutorPhotoSrc = getImageSrc(tutor.photo);

//   return (
//     <div className="tutor-detail-page">
//       <div className="detail-breadcrumb">
//         <button type="button" onClick={() => navigate(backTo)}>
//           ← Tutors
//         </button>
//         <span>»</span>
//         <b>View details</b>
//       </div>

//       <div className="detail-card">
//         <div className="detail-actions">
//           {!active && <span className="detail-inactive-badge">Inactive</span>}

//           <button type="button" className="detail-edit-btn" onClick={openEditModal}>
//             ✎ Edit
//           </button>

//           <button
//             type="button"
//             className="detail-share-btn"
//             onClick={() => shareTutorDetails(tutor, showAlert)}
//           >
//             ↗ Share
//           </button>

//           <button
//   type="button"
//   className="detail-assigned-btn"
//   onClick={openAssignedStudentsModal}
// >
//   👥 Assigned Students
// </button>

//           <button
//             type="button"
//             className="detail-delete-btn"
//             onClick={() => setDeleteOpen(true)}
//           >
//             🗑 Delete
//           </button>
//         </div>

//         <div className="detail-head">
//           <div className="detail-avatar">
//             {tutorPhotoSrc ? (
//               <img src={tutorPhotoSrc} alt={tutor.name} />
//             ) : (
//               <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
//             )}
//           </div>

//           <div className="detail-title">
//             <h2>{tutor.name}</h2>
//             <p>{tutor.qualification || "Qualification not added"}</p>
//             <Stars rating={tutor.averageRating} />
//           </div>
//         </div>

//         <div className="detail-info-grid">
//           <div className="detail-info-box">
//             <span>Phone</span>
//             <b>{tutor.phone || "Not added"}</b>
//           </div>

//           <div className="detail-info-box">
//             <span>Email</span>
//             <b>{tutor.email || "Not added"}</b>
//           </div>

//           <div className="detail-info-box">
//             <span>Course / Class</span>
//             <b>{getCourseNames(tutor) || "Not added"}</b>
//           </div>

//           {isOnlineTuition && (
//             <div className="detail-info-box">
//               <span>Syllabus</span>
//               <b>{formatSyllabus(tutor.syllabus)}</b>
//             </div>
//           )}
//         </div>

//         <section className="detail-section">
//           <h3>About</h3>
//           <p>{tutor.about || "No description added."}</p>
//         </section>

//         <section className="detail-section">
//           <h3>Subjects</h3>

//           {subjects.length ? (
//             <div className="subject-pills">
//               {subjects.map((subject) => (
//                 <span key={subject}>{subject}</span>
//               ))}
//             </div>
//           ) : (
//             <p>No subjects added.</p>
//           )}
//         </section>

//         <section className="detail-section">
//           <div className="reviews-head">
//             <h3>Recent Reviews</h3>

//             {tutor.reviews?.length > 2 && (
//               <button
//                 type="button"
//                 className="show-more-btn"
//                 onClick={() => setReviewsOpen(true)}
//               >
//                 Show more
//               </button>
//             )}
//           </div>

//           {recentReviews.length ? (
//             <div className="review-list">
//               {recentReviews.map((review) => (
//                 <ReviewCard key={review._id} review={review} />
//               ))}
//             </div>
//           ) : (
//             <div className="empty-reviews">No reviews yet.</div>
//           )}

//           {tutor.reviews?.length > 0 && tutor.reviews?.length <= 2 && (
//             <button
//               type="button"
//               className="show-more-btn show-more-btn--single"
//               onClick={() => setReviewsOpen(true)}
//             >
//               Show more
//             </button>
//           )}
//         </section>

//         <button
//           type="button"
//           className="tutor-contact-btn"
//           onClick={contactTutor}
//         >
//           Contact
//         </button>
//       </div>

//       <Modal
//         open={reviewsOpen}
//         title="All Reviews"
//         width="760px"
//         onClose={() => setReviewsOpen(false)}
//       >
//         {tutor.reviews?.length ? (
//           <div className="all-reviews-list">
//             {tutor.reviews.map((review) => (
//               <ReviewCard key={review._id} review={review} />
//             ))}
//           </div>
//         ) : (
//           <div className="empty-reviews">No reviews yet.</div>
//         )}
//       </Modal>





//       <Modal
//         open={editOpen}
//         title="Edit Tutor"
//         width="850px"
//         onClose={() => setEditOpen(false)}
//       >
//       <form className="detail-form" onSubmit={updateTutor}>
//   <div className="detail-form-grid">
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
//           <div className="detail-photo-preview">
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











// {/* 


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

//             {selectedCategory?.key === "online_tuition" && (
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

//             {selectedCategory?.key === "online_tuition" && (
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
//                 {selectedCategory?.key === "online_tuition" &&
//                 form.sectionType === "batch"
//                   ? "Batch"
//                   : selectedCategory?.key === "online_tuition" &&
//                     form.sectionType === "both"
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
//                           {selectedCategory?.key === "online_tuition" &&
//                           form.sectionType === "both"
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
//             </div> */}




// {/* 
// <div className="form-field form-field--full">
//   <span>Categories</span>

//   <div className="course-checkbox-list tutor-category-checkbox-list">
//     {categories.length === 0 ? (
//       <p className="course-empty-text">No categories found</p>
//     ) : (
//       categories.map((cat) => {
//         const checked = Array.isArray(form.categoryIds)
//           ? form.categoryIds.includes(cat._id)
//           : false;

//         return (
//           <label key={cat._id} className="course-check-item">
//             <input
//               type="checkbox"
//               checked={checked}
//               onChange={(e) =>
//                 toggleCategorySelection(cat._id, e.target.checked)
//               }
//             />

//             <span>{cat.title}</span>
//           </label>
//         );
//       })
//     )}
//   </div>
// </div>

// {isOnlineTuition && (
//   <label className="form-field form-field--full">
//     <span>Syllabus</span>
//     <input
//       type="text"
//       name="syllabus"
//       value={form.syllabus}
//       onChange={handleChange}
//       placeholder="Example: State, CBSE, ICSE"
//     />
//   </label>
// )}

// <div className="form-field form-field--full">
//   <span>Courses / Classes</span>

//   <div className="course-checkbox-list tutor-course-checkbox-list">
//     {visibleCourses.length === 0 ? (
//       <p className="course-empty-text">No courses found</p>
//     ) : (
//       visibleCourses.map((course) => {
//         const checked = Array.isArray(form.courseIds)
//           ? form.courseIds.includes(course._id)
//           : false;

//         const category = getCourseCategory(course, categories);

//         return (
//           <label key={course._id} className="course-check-item">
//             <input
//               type="checkbox"
//               checked={checked}
//               onChange={(e) =>
//                 toggleCourseSelection(course._id, e.target.checked)
//               }
//             />

//             <span>
//               {getCourseLabel(course, categories)}
//               {category?.title ? (
//                 <small className="course-category-name">
//                   {category.title}
//                 </small>
//               ) : null}
//             </span>
//           </label>
//         );
//       })
//     )}
//   </div>
// </div> */}













// <div className="form-field form-field--full">
//   <span>Categories</span>

//   <div className="course-checkbox-list tutor-category-checkbox-list">
//     {categories.length === 0 ? (
//       <p className="course-empty-text">No categories found</p>
//     ) : (
//       categories.map((cat) => {
//         const checked = Array.isArray(form.categoryIds)
//           ? form.categoryIds.includes(cat._id)
//           : false;

//         return (
//           <label key={cat._id} className="course-check-item">
//             <input
//               type="checkbox"
//               checked={checked}
//               onChange={(e) =>
//                 toggleCategorySelection(cat._id, e.target.checked)
//               }
//             />

//             <span>{cat.title}</span>
//           </label>
//         );
//       })
//     )}
//   </div>
// </div>

// {isOnlineTuition && (
//   <label className="form-field form-field--full">
//     <span>Syllabus</span>
//     <input
//       type="text"
//       name="syllabus"
//       value={form.syllabus}
//       onChange={handleChange}
//       placeholder="Example: State, CBSE, ICSE"
//     />
//   </label>
// )}

// <div className="form-field form-field--full">
//   <span>Courses / Classes</span>

//   <div className="course-checkbox-list tutor-course-checkbox-list">
//     {visibleCourses.length === 0 ? (
//       <p className="course-empty-text">No courses found</p>
//     ) : (
//       visibleCourses.map((course) => {
//         const checked = Array.isArray(form.courseIds)
//           ? form.courseIds.includes(course._id)
//           : false;

//         return (
//           <label key={course._id} className="course-check-item">
//             <input
//               type="checkbox"
//               checked={checked}
//               onChange={(e) =>
//                 toggleCourseSelection(course._id, e.target.checked)
//               }
//             />

//             <span>
//               {getCourseLabel(course, categories)}

//               <small>
//                 {getCourseCategory(course, categories)?.title || ""}
//               </small>
//             </span>
//           </label>
//         );
//       })
//     )}
//   </div>
// </div>










//           </div>

//           <div className="form-actions">
//             <button
//               type="button"
//               className="secondary-btn"
//               onClick={() => setEditOpen(false)}
//               disabled={submitting}
//             >
//               Cancel
//             </button>

//             <button type="submit" className="primary-btn" disabled={submitting}>
//               {submitting ? "Updating..." : "Update"}
//             </button>
//           </div>
//         </form>
//       </Modal>

//       <Modal
//         open={deleteOpen}
//         title="Delete Tutor"
//         width="430px"
//         onClose={() => setDeleteOpen(false)}
//       >
//         <div className="delete-confirm-box">
//           <p>
//             <b>{tutor.name}</b> Do you want to delete this tutor?
//           </p>

//           <div className="form-actions">
//             <button
//               type="button"
//               className="secondary-btn"
//               onClick={() => setDeleteOpen(false)}
//               disabled={submitting}
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               className="danger-btn"
//               onClick={deleteTutor}
//               disabled={submitting}
//             >
//               {submitting ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         </div>
//       </Modal>

// <Modal
//   open={assignedStudentsOpen}
//   title={`Assigned Students${tutor?.name ? ` - ${tutor.name}` : ""}`}
//   width="760px"
//   onClose={() => setAssignedStudentsOpen(false)}
// >
//   <div className="assigned-students-box">
//     {assignedStudentsLoading ? (
//       <div className="assigned-students-state">Loading students...</div>
//     ) : assignedStudents.length === 0 ? (
//       <div className="assigned-students-state">
//         No students assigned to this tutor yet.
//       </div>
//     ) : (
//       <div className="assigned-students-list">
//         {assignedStudents.map((student) => {
//           const photo = student.photo ? getImageSrc(student.photo) : "";

//           return (
//             <div key={student._id} className="assigned-student-card">
//               <div className="assigned-student-avatar">
//                 {photo ? (
//                   <img src={photo} alt={student.name || "Student"} />
//                 ) : (
//                   <span>{student.name?.charAt(0)?.toUpperCase() || "S"}</span>
//                 )}
//               </div>

//               <div className="assigned-student-info">
//                 <h4>{student.name || "Student"}</h4>
//                 <p>{student.email || "No email added"}</p>
//                 <small>{student.phone || "No phone added"}</small>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     )}
//   </div>
// </Modal>

//     </div>
//   );
// }































































// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Modal from "./Components/Modal";
// import { useAlert } from "./context/AlertContext";
// // import { getMediaUrl } from "./utils/media";
// import { getMediaUrl } from "../utils/media";
// // import api from "./api/axios";
// import api from "../api/axios";
// import "./AdminTutorDetailsPage.css";



import { FiEye, FiEyeOff } from "react-icons/fi";


import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

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
  categoryIds: [],
  syllabus: "",
  courseIds: [],
  photo: null,
};

function normalizeId(value) {
  if (!value) return "";
  return typeof value === "object" ? String(value._id || "") : String(value);
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

function getName(value) {
  if (!value) return "";
  return typeof value === "object" ? value.name || value.title || "" : "";
}

function getCourseNames(tutor) {
  if (Array.isArray(tutor?.courseIds) && tutor.courseIds.length > 0) {
    const names = tutor.courseIds.map((c) => getName(c)).filter(Boolean);
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
        <span key={n} className={n <= rounded ? "detail-star filled" : "detail-star"}>
          ★
        </span>
      ))}
      {!compact && <b>{fixedRating.toFixed(1)}</b>}
    </div>
  );
}

function getStudentName(review) {
  return review?.studentId?.name || review?.studentName || "Student";
}

// function getStudentPhoto(review) {
//   return review?.studentId?.photo || review?.studentPhoto || review?.photo || "";
// }





function getStudentPhoto(review) {
  const photo =
    review?.studentId?.photo ||
    review?.studentPhoto ||
    review?.photo ||
    "";

  const cleanPhoto = String(photo || "").trim();

  if (!cleanPhoto) return "";

  if (
    cleanPhoto === "null" ||
    cleanPhoto === "undefined" ||
    cleanPhoto === "false" ||
    cleanPhoto === "NaN"
  ) {
    return "";
  }

  return cleanPhoto;
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
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }
}

function ReviewCard({ review }) {
  const [imageError, setImageError] = useState(false);
  const name = getStudentName(review);
  const photoSrc = getImageSrc(getStudentPhoto(review));

  return (
    <div className="review-card">
      <div className="review-card__left">
        <div className="review-avatar">
          {photoSrc && !imageError ? (
            <img src={photoSrc} alt={name} onError={() => setImageError(true)} />
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

//////////////////////////////////////////////////////////////////////////////////////////////////////
// const backTo = location.state?.backTo || "/admin/tutors";
// const backLabel = location.state?.courseName || "View details";







// const backTo = location.state?.backTo || "/admin/tutors";



const savedBackData = (() => {
  try {
    return JSON.parse(sessionStorage.getItem("adminTutorBackData") || "{}");
  } catch {
    return {};
  }
})();

const backTo =
  location.state?.backTo || savedBackData?.backTo || "/admin/tutors";

const backButtonLabel =
  location.state?.backButtonLabel ||
  savedBackData?.backButtonLabel ||
  "Tutors";

const backLabel =
  location.state?.backLabel || savedBackData?.backLabel || "View details";

const savedCourseName =
  location.state?.courseName || savedBackData?.courseName || "";







// const backLabel = location.state?.backLabel || "View details";






////////////////////////////////////////////////////////////////////////////////////////////////////////

  const { showAlert } = useAlert();

  // const backTo = location.state?.backTo || "/admin/tutors";

  const [tutor, setTutor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const [passwordOpen, setPasswordOpen] = useState(false);
const [showPassword, setShowPassword] = useState(false);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const [assignedStudentsOpen, setAssignedStudentsOpen] = useState(false);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [assignedStudentsLoading, setAssignedStudentsLoading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);



const [detailMenuOpen, setDetailMenuOpen] = useState(false);






  const selectedCategories = useMemo(() => {
    return categories.filter((cat) =>
      Array.isArray(form.categoryIds)
        ? form.categoryIds.map(String).includes(String(cat._id))
        : false
    );
  }, [categories, form.categoryIds]);

  const formHasOnlineTuition = useMemo(() => {
    return selectedCategories.some((cat) => cat.key === "online_tuition");
  }, [selectedCategories]);

  const visibleCourses = useMemo(() => {
    if (!Array.isArray(form.categoryIds) || form.categoryIds.length === 0) return [];

    const selectedIds = form.categoryIds.map(String);

    return courses.filter((course) =>
      selectedIds.includes(String(normalizeId(course.categoryId)))
    );
  }, [courses, form.categoryIds]);

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

    const existingCategoryIds =
      Array.isArray(tutor.categoryIds) && tutor.categoryIds.length
        ? tutor.categoryIds.map((cat) => normalizeId(cat)).filter(Boolean)
        : tutor.categoryId
          ? [normalizeId(tutor.categoryId)]
          : [];

    const existingCourseIds =
      Array.isArray(tutor.courseIds) && tutor.courseIds.length
        ? tutor.courseIds.map((course) => normalizeId(course)).filter(Boolean)
        : tutor.courseId
          ? [normalizeId(tutor.courseId)]
          : [];

    const onlineSelected = existingCategoryIds.some((catId) => {
      const cat = categories.find((item) => String(item._id) === String(catId));
      return cat?.key === "online_tuition";
    });

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
      photo: null,
    });

    setPreview(tutor.photo ? getImageSrc(tutor.photo) : "");
    setEditOpen(true);
  }

  useEffect(() => {
    if (!loading && tutor && location.state?.openEdit && !editOpen) {
      openEditModal();
      // navigate(location.pathname, { replace: true, state: {} });



navigate(location.pathname, {
  replace: true,
  state: {
    backTo,
    backButtonLabel,
    backLabel,
    courseName: savedCourseName,
  },
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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

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
      const currentCourseIds = Array.isArray(prev.courseIds)
        ? prev.courseIds.map(String)
        : [];

      const selectedCategoryIds = Array.isArray(prev.categoryIds)
        ? prev.categoryIds.map(String)
        : [];

      const allowedCourseIds = courses
        .filter((course) =>
          selectedCategoryIds.includes(String(normalizeId(course.categoryId)))
        )
        .map((course) => String(course._id));

      const normalizedCourseId = String(courseId);

      let nextCourseIds = checked
        ? Array.from(new Set([...currentCourseIds, normalizedCourseId]))
        : currentCourseIds.filter((id) => id !== normalizedCourseId);

      nextCourseIds = nextCourseIds.filter((id) => allowedCourseIds.includes(id));

      return {
        ...prev,
        courseIds: nextCourseIds,
      };
    });
  }

  async function updateTutor(e) {
    e.preventDefault();

    try {
      if (!form.name.trim()) return showAlert("Tutor name required", "error");
      if (!form.phone.trim()) return showAlert("Phone required", "error");

      if (!Array.isArray(form.categoryIds) || form.categoryIds.length === 0) {
        return showAlert("At least one category select cheyyuka", "error");
      }

      if (formHasOnlineTuition && !String(form.syllabus || "").trim()) {
        return showAlert("Syllabus enter cheyyuka", "error");
      }

      if (!Array.isArray(form.courseIds) || form.courseIds.length === 0) {
        return showAlert("At least one Course / Class select cheyyuka", "error");
      }

      setSubmitting(true);

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

      form.courseIds.forEach((courseId) => {
        fd.append("courseIds", courseId);
      });

      fd.append("courseId", form.courseIds[0]);
      fd.append("sectionType", formHasOnlineTuition ? "both" : "none");
      fd.append("syllabus", formHasOnlineTuition ? String(form.syllabus).trim() : "none");

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





async function toggleTutorStatus() {
  try {
    await api.patch(`/admin/tuter/status/${tuterId}`, {
      isActive: !isTutorActive(tutor),
    });

    showAlert(
      isTutorActive(tutor)
        ? "Tutor deactivated successfully"
        : "Tutor activated successfully",
      "success"
    );

    setDetailMenuOpen(false);
    fetchData();
  } catch (err) {
    showAlert(getErrorMessage(err), "error");
  }
}

async function toggleTutorBlock() {
  try {
    await api.patch(`/admin/tuter/block/${tuterId}`, {
      isBlocked: !isTutorBlocked(tutor),
    });

    showAlert(
      isTutorBlocked(tutor)
        ? "Tutor unblocked successfully"
        : "Tutor blocked successfully",
      "success"
    );

    setDetailMenuOpen(false);
    fetchData();
  } catch (err) {
    showAlert(getErrorMessage(err), "error");
  }
}






  async function openAssignedStudentsModal() {
    try {
      setAssignedStudentsOpen(true);
      setAssignedStudentsLoading(true);

      const { data } = await api.get(`/admin/tuter/${tuterId}/assigned-students`);
      setAssignedStudents(data.students || []);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load assigned students"), "error");
    } finally {
      setAssignedStudentsLoading(false);
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
  const tutorHasOnlineTuition =
    Array.isArray(tutor.categoryIds) && tutor.categoryIds.length
      ? tutor.categoryIds.some((cat) => cat?.key === "online_tuition")
      : tutor?.categoryId?.key === "online_tuition";

  const tutorPhotoSrc = getImageSrc(tutor.photo);

  return (
    <div className="tutor-detail-page">
     <div className="detail-breadcrumb">
  <button
    type="button"
    onClick={() =>
      navigate(backTo, {
        state: {
          courseName: savedCourseName,
        },
      })
    }
  >
    ← {backButtonLabel}
  </button>

  <span>»</span>
  <b>{backLabel}</b>
</div>

      <div className="detail-card">
        {/* <div className="detail-actions">
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
        </div> */}







<div className="detail-actions detail-actions-menu-wrap">
  {isTutorBlocked(tutor) ? (
    <span className="detail-blocked-badge">Blocked</span>
  ) : !active ? (
    <span className="detail-inactive-badge">Inactive</span>
  ) : null}

  <button
    type="button"
    className="detail-menu-btn"
    onClick={() => setDetailMenuOpen((prev) => !prev)}
  >
    ⋮
  </button>

  {detailMenuOpen && (
    <div className="detail-menu">
      <button
        type="button"
        onClick={() => {
          setDetailMenuOpen(false);
          openEditModal();
        }}
      >
        ✎ Edit
      </button>




<button
  type="button"
  onClick={() => {
    setPasswordOpen(true);
    setDetailMenuOpen(false);
    setShowPassword(false);
  }}
>
  🔐 Password
</button>



      <button
        type="button"
        onClick={() => {
          setDetailMenuOpen(false);
          shareTutorDetails(tutor, showAlert);
        }}
      >
        ↗ Share
      </button>

      <button
        type="button"
        onClick={() => {
          setDetailMenuOpen(false);
          openAssignedStudentsModal();
        }}
      >
        👥 Assigned Students
      </button>

      <button type="button" onClick={toggleTutorStatus}>
        ⏻ {active ? "Deactive" : "Active"}
      </button>

      <button type="button" onClick={toggleTutorBlock}>
        ⊘ {isTutorBlocked(tutor) ? "Unblock" : "Block"}
      </button>

      <button
        type="button"
        onClick={() => {
          setDetailMenuOpen(false);
          setDeleteOpen(true);
        }}
      >
        🗑 Delete
      </button>
    </div>
  )}
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

          {tutorHasOnlineTuition && (
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

        <button type="button" className="tutor-contact-btn" onClick={contactTutor}>
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
              <input type="file" name="photo" accept="image/*" onChange={handleChange} />
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

            <div className="form-field form-field--full">
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
            </div>

            {formHasOnlineTuition && (
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
            <b>{tutor?.name}</b> Do you want to delete this tutor?
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
        title="Assigned Students"
        width="650px"
        onClose={() => setAssignedStudentsOpen(false)}
      >
        <div className="assigned-students-box">
          {assignedStudentsLoading ? (
            <div className="assigned-students-state">Loading students...</div>
          ) : assignedStudents.length === 0 ? (
            <div className="assigned-students-state">No students assigned.</div>
          ) : (
            <div className="assigned-students-list">
              {assignedStudents.map((student) => {
                const photoSrc = getImageSrc(student.photo);

                return (
                  <div key={student._id} className="assigned-student-card">
                    <div className="assigned-student-avatar">
                      {photoSrc ? (
                        <img src={photoSrc} alt={student.name} />
                      ) : (
                        <span>{student.name?.charAt(0)?.toUpperCase() || "S"}</span>
                      )}
                    </div>

                    <div className="assigned-student-info">
                      <h4>{student.name || "Student"}</h4>
                      <p>{student.email || "No email"}</p>
                      <small>{student.phone || "No phone"}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Modal>





<Modal
  open={passwordOpen}
  title="Tutor Login Password"
  width="430px"
  onClose={() => setPasswordOpen(false)}
>
  <div className="tutor-password-view-box">
    <p>
      <b>{tutor?.name}</b> login password
    </p>

    <div className="tutor-password-field">
      <input
        type={showPassword ? "text" : "password"}
        value={tutor?.loginPasswordText || "Password not available"}
        readOnly
      />

      <button
        type="button"
        className="tutor-password-eye"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>

    <button
      type="button"
      className="primary-btn"
      onClick={() => {
        navigator.clipboard.writeText(tutor?.loginPasswordText || "");
        showAlert("Password copied successfully", "success");
      }}
      disabled={!tutor?.loginPasswordText}
    >
      Copy Password
    </button>
  </div>
</Modal>



    </div>
  );
}