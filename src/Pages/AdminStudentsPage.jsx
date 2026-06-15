


// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import Modal from "../Components/Modal";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import api from "../api/axios";
// import "./AdminStudentsPage.css";

// const emptyInviteForm = {
//   name: "",
//   email: "",
//   phone: "",
// };

// const emptyEditForm = {
//   name: "",
//   email: "",
//   phone: "",
//   photo: "",
// };

// function getErrorMessage(error, fallback = "Something went wrong") {
//   return (
//     error?.response?.data?.msg ||
//     error?.response?.data?.error ||
//     error?.message ||
//     fallback
//   );
// }

// function getStudentId(student) {
//   return student?._id || student?.id;
// }

// function getStudentPhoto(photo) {
//   if (!photo) return "";

//   const src = String(photo).trim();

//   if (
//     src.startsWith("data:") ||
//     src.startsWith("blob:") ||
//     src.startsWith("http://") ||
//     src.startsWith("https://")
//   ) {
//     return src;
//   }

//   return getMediaUrl(src);
// }

// function isNewStudent(student) {
//   if (!student?.createdAt) return false;

//   const createdTime = new Date(student.createdAt).getTime();
//   if (Number.isNaN(createdTime)) return false;

//   return Date.now() - createdTime <= 24 * 60 * 60 * 1000;
// }

// function resizeImageToBase64(file, maxSize = 420, quality = 0.72) {
//   return new Promise((resolve, reject) => {
//     if (!file.type.startsWith("image/")) {
//       reject(new Error("Please select an image file"));
//       return;
//     }

//     const reader = new FileReader();

//     reader.onload = () => {
//       const img = new Image();

//       img.onload = () => {
//         const canvas = document.createElement("canvas");

//         let { width, height } = img;

//         if (width > height) {
//           if (width > maxSize) {
//             height = Math.round((height * maxSize) / width);
//             width = maxSize;
//           }
//         } else if (height > maxSize) {
//           width = Math.round((width * maxSize) / height);
//           height = maxSize;
//         }

//         canvas.width = width;
//         canvas.height = height;

//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0, width, height);

//         resolve(canvas.toDataURL("image/jpeg", quality));
//       };

//       img.onerror = () => reject(new Error("Image load failed"));
//       img.src = reader.result;
//     };

//     reader.onerror = () => reject(new Error("Image read failed"));
//     reader.readAsDataURL(file);
//   });
// }

// export default function AdminStudentsPage() {
//   const { showAlert } = useAlert();
//   const location = useLocation();
//   const firstNewCardRef = useRef(null);

//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [menuOpenId, setMenuOpenId] = useState(null);

//   const [inviteOpen, setInviteOpen] = useState(false);
//   const [inviteForm, setInviteForm] = useState(emptyInviteForm);

//   const [editOpen, setEditOpen] = useState(false);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [editForm, setEditForm] = useState(emptyEditForm);
//   const [preview, setPreview] = useState("");

//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const [submitting, setSubmitting] = useState(false);







//   const [tutors, setTutors] = useState([]);
//   const [assignOpen, setAssignOpen] = useState(false);
//   const [assignStudent, setAssignStudent] = useState(null);
//   // const [assignedTutorIds, setAssignedTutorIds] = useState([]);




//   const [assignedTutors, setAssignedTutors] = useState({});

//   const [courseSelectOpen, setCourseSelectOpen] = useState(false);

//   const [selectedTutor, setSelectedTutor] = useState(null);






//   const [assignSearch, setAssignSearch] = useState("");
//   const [assignLoading, setAssignLoading] = useState(false);






//   const showOnlyNew =
//     new URLSearchParams(location.search).get("filter") === "new";

//   const filteredStudents = useMemo(() => {
//     let result = students;

//     if (showOnlyNew) {
//       result = result.filter((student) => isNewStudent(student));
//     }

//     const q = search.toLowerCase().trim();

//     if (!q) return result;

//     return result.filter((student) => {
//       return (
//         String(student.name || "").toLowerCase().includes(q) ||
//         String(student.email || "").toLowerCase().includes(q) ||
//         String(student.phone || "").toLowerCase().includes(q)
//       );
//     });
//   }, [students, search, showOnlyNew]);

//   async function fetchStudents() {
//     try {
//       setLoading(true);

//       const { data } = await api.get("/admin/student/all");
//       setStudents(data.students || []);
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to load students"), "error");
//     } finally {
//       setLoading(false);
//     }
//   }




//   async function fetchTutors() {
//     try {
//       const { data } = await api.get("/admin/tuter/all");
//       setTutors(data.tuters || []);
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
//     }
//   }



//   // useEffect(() => {
//   //   fetchStudents();
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, []);




//   useEffect(() => {
//     fetchStudents();
//     fetchTutors();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);


//   useEffect(() => {
//     if (!loading && showOnlyNew && firstNewCardRef.current) {
//       setTimeout(() => {
//         firstNewCardRef.current?.scrollIntoView({
//           behavior: "smooth",
//           block: "center",
//         });
//       }, 200);
//     }
//   }, [loading, showOnlyNew, filteredStudents.length]);

//   function openInviteModal() {
//     setInviteForm(emptyInviteForm);
//     setInviteOpen(true);
//   }

//   async function sendInvite(e) {
//     e.preventDefault();

//     try {
//       if (!inviteForm.name.trim()) {
//         return showAlert("Student name required", "error");
//       }

//       if (!inviteForm.email.trim()) {
//         return showAlert("Student email required", "error");
//       }

//       if (!inviteForm.phone.trim()) {
//         return showAlert("Student phone required", "error");
//       }

//       setSubmitting(true);

//       await api.post("/admin/student/invite", {
//         name: inviteForm.name.trim(),
//         email: inviteForm.email.trim(),
//         phone: inviteForm.phone.trim(),
//       });

//       showAlert("Invite mail sent successfully", "success");
//       setInviteOpen(false);
//       setInviteForm(emptyInviteForm);
//       fetchStudents();
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to send invite"), "error");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   function openEditModal(student) {
//     setEditingStudent(student);
//     setEditForm({
//       name: student.name || "",
//       email: student.email || "",
//       phone: student.phone || "",
//       photo: student.photo || "",
//     });
//     setPreview(getStudentPhoto(student.photo));
//     setEditOpen(true);
//     setMenuOpenId(null);
//   }

//   async function handlePhotoChange(e) {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     try {
//       if (file.size > 5 * 1024 * 1024) {
//         showAlert("Image size 5MB-il താഴെ ആയിരിക്കണം", "error");
//         return;
//       }

//       const compressedBase64 = await resizeImageToBase64(file, 420, 0.72);

//       setEditForm((prev) => ({
//         ...prev,
//         photo: compressedBase64,
//       }));

//       setPreview(compressedBase64);
//     } catch (err) {
//       showAlert(err.message || "Photo select cheyyan kazhinjilla", "error");
//     }
//   }

//   async function updateStudent(e) {
//     e.preventDefault();

//     try {
//       if (!editingStudent) return;

//       if (!editForm.name.trim()) {
//         return showAlert("Student name required", "error");
//       }

//       if (!editForm.email.trim()) {
//         return showAlert("Student email required", "error");
//       }

//       if (!editForm.phone.trim()) {
//         return showAlert("Student phone required", "error");
//       }

//       setSubmitting(true);

//       await api.put(`/admin/student/update/${getStudentId(editingStudent)}`, {
//         name: editForm.name.trim(),
//         email: editForm.email.trim(),
//         phone: editForm.phone.trim(),
//         photo: editForm.photo || "",
//       });

//       showAlert("Student updated successfully", "success");
//       setEditOpen(false);
//       setEditingStudent(null);
//       setEditForm(emptyEditForm);
//       setPreview("");
//       fetchStudents();
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to update student"), "error");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   function askDeleteStudent(student) {
//     setDeleteTarget(student);
//     setDeleteOpen(true);
//     setMenuOpenId(null);
//   }

//   async function deleteStudent() {
//     try {
//       if (!deleteTarget) return;

//       setSubmitting(true);

//       await api.delete(`/admin/student/delete/${getStudentId(deleteTarget)}`);

//       showAlert("Student account deleted successfully", "success");
//       setDeleteOpen(false);
//       setDeleteTarget(null);
//       fetchStudents();
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to delete student"), "error");
//     } finally {
//       setSubmitting(false);
//     }
//   }


//   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   const filteredAssignTutors = useMemo(() => {
//     const q = assignSearch.toLowerCase().trim();

//     if (!q) return tutors;

//     return tutors.filter((tutor) => {
//       return (
//         String(tutor.name || "").toLowerCase().includes(q) ||
//         String(tutor.email || "").toLowerCase().includes(q) ||
//         String(tutor.phone || "").toLowerCase().includes(q) ||
//         String(tutor.qualification || "").toLowerCase().includes(q)
//       );
//     });
//   }, [tutors, assignSearch]);

//   // async function openAssignTutorModal(student) {
//   //   try {
//   //     setAssignStudent(student);
//   //     setAssignedTutorIds([]);
//   //     setAssignSearch("");
//   //     setAssignOpen(true);
//   //     setMenuOpenId(null);
//   //     setAssignLoading(true);

//   //     const { data } = await api.get(
//   //       `/admin/student/${getStudentId(student)}/assigned-tutors`
//   //     );

//   //     const ids = (data.tutors || []).map((tutor) => tutor._id);
//   //     setAssignedTutorIds(ids);
//   //   } catch (err) {
//   //     showAlert(getErrorMessage(err, "Failed to load assigned tutors"), "error");
//   //   } finally {
//   //     setAssignLoading(false);
//   //   }
//   // }


//   // async function openAssignTutorModal(student) {
//   //   try {

//   //     setAssignStudent(student);
//   //     setAssignOpen(true);

//   //     setAssignSearch("");

//   //     setAssignLoading(true);

//   //     const { data } = await api.get(
//   //       `/admin/student/${getStudentId(student)}/assigned-tutors`
//   //     );

//   //     const obj = {};

//   //     (data.assignments || []).forEach(item => {

//   //       obj[item.tutorId] = item.courseIds || [];

//   //     });

//   //     setAssignedTutors(obj);

//   //   } catch (err) {

//   //     showAlert(
//   //       getErrorMessage(
//   //         err,
//   //         "Failed loading assignments"
//   //       ),
//   //       "error"
//   //     )

//   //   } finally {

//   //     setAssignLoading(false)

//   //   }
//   // }






// // async function openAssignTutorModal(student) {

// //   try {

// //     setAssignStudent(student);

// //     setAssignOpen(true);

// //     setAssignSearch("");

// //     setAssignLoading(true);

// //     const { data } = await api.get(
// //       `/admin/student/${getStudentId(student)}/assigned-tutors`
// //     );

// //     const obj = {};

// //     (data.assignments || []).forEach((item) => {

// //       const tutorId =
// //         item?.tutorId?._id ||
// //         item?.tutorId;

// //       obj[tutorId] =
// //         (item?.courseIds || []).map(
// //           course =>
// //             course?._id || course
// //         );

// //     });

// //     setAssignedTutors(obj);

// //   } catch (err) {

// //     showAlert(
// //       getErrorMessage(
// //         err,
// //         "Failed loading assignments"
// //       ),
// //       "error"
// //     );

// //   } finally {

// //     setAssignLoading(false);

// //   }

// // }

// async function openAssignTutorModal(student) {
//   try {
//     setAssignStudent(student);
//     setAssignOpen(true);
//     setAssignSearch("");
//     setAssignLoading(true);
//     setMenuOpenId(null);

//     const { data } = await api.get(
//       `/admin/student/${getStudentId(student)}/assigned-tutors`
//     );

//     const obj = {};

//     (data.assignments || []).forEach((item) => {
//       const tutorId = item?.tutorId?._id || item?.tutorId;

//       const courseIds = (item?.courseIds || [])
//         .map((course) => course?._id || course)
//         .filter(Boolean)
//         .map(String);

//       if (tutorId && courseIds.length > 0) {
//         obj[String(tutorId)] = courseIds;
//       }
//     });

//     setAssignedTutors(obj);
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed loading assignments"), "error");
//   } finally {
//     setAssignLoading(false);
//   }
// }








//   // function openTutorCourses(tutor) {

//   //   setSelectedTutor(tutor)

//   //   setCourseSelectOpen(true)

//   // }






// function openTutorCourses(
//  tutor
// ){

// setSelectedTutor(
//  tutor
// );

// if(
// !assignedTutors[
// tutor._id
// ]
// ){

// setAssignedTutors(
// prev=>({

// ...prev,

// [tutor._id]:[]

// })
// )

// }

// setCourseSelectOpen(
// true
// )

// }





//   function toggleCourse(tutorId, courseId) {

//     setAssignedTutors(prev => {

//       const existing = prev[tutorId] || [];

//       let updated;

//       if (existing.includes(courseId)) {

//         updated =
//           existing.filter(
//             x => x !== courseId
//           )

//       } else {

//         updated = [
//           ...existing,
//           courseId
//         ]

//       }

//       const newState = { ...prev };

//       if (updated.length === 0) {

//         delete newState[tutorId];

//       } else {

//         newState[tutorId] = updated;

//       }

//       return newState;

//     })

//   }



//   // function toggleAssignedTutor(tutorId, checked) {
//   //   setAssignedTutorIds((prev) => {
//   //     if (checked) {
//   //       return Array.from(new Set([...prev, tutorId]));
//   //     }

//   //     return prev.filter((id) => id !== tutorId);
//   //   });
//   // }











//   // function toggleAssignedTutor(tutor, checked) {

//   //   if (!checked) {

//   //     setAssignedTutors(prev => {

//   //       const obj = { ...prev };

//   //       delete obj[tutor._id];

//   //       return obj;

//   //     })

//   //     return;

//   //   }

//   //   openTutorCourses(tutor)

//   // }







// function toggleAssignedTutor(
//  tutor,
//  checked
// ){

// if(!checked){

// const selected=
// assignedTutors[
//  tutor._id
// ] || [];

// if(selected.length>0){

// showAlert(
// "Remove selected courses first",
// "error"
// );

// return;

// }

// setAssignedTutors(prev=>{

// const obj={...prev};

// delete obj[tutor._id];

// return obj;

// });

// return;

// }

// openTutorCourses(
//  tutor
// );

// }








//   // async function saveAssignedTutors() {
//   //   try {
//   //     if (!assignStudent) return;

//   //     setSubmitting(true);

//   //     await api.post(`/admin/student/${getStudentId(assignStudent)}/assign-tutors`, {
//   //       tutorIds: assignedTutorIds,
//   //     });

//   //     showAlert("Tutors assigned successfully", "success");
//   //     setAssignOpen(false);
//   //     setAssignStudent(null);
//   //     setAssignedTutorIds([]);
//   //   } catch (err) {
//   //     showAlert(getErrorMessage(err, "Failed to assign tutors"), "error");
//   //   } finally {
//   //     setSubmitting(false);
//   //   }
//   // }




//   // async function saveAssignedTutors() {

//   //   try {

//   //     setSubmitting(true)

//   //     const payload =
//   //       Object.entries(
//   //         assignedTutors
//   //       ).map(
//   //         ([tutorId, courseIds]) => ({

//   //           tutorId,
//   //           courseIds

//   //         })
//   //       )

//   //     await api.post(

//   //       `/admin/student/${getStudentId(assignStudent)}/assign-tutors`,

//   //       {

//   //         assignments: payload

//   //       }

//   //     )

//   //     showAlert(
//   //       "Assigned successfully",
//   //       "success"
//   //     )

//   //     setAssignOpen(false)

//   //     setAssignStudent(null)

//   //   } catch (err) {

//   //     showAlert(
//   //       getErrorMessage(err),
//   //       "error"
//   //     )

//   //   }
//   //   finally {

//   //     setSubmitting(false)

//   //   }

//   // }




// async function saveAssignedTutors() {
//   try {
//     if (!assignStudent) {
//       return showAlert("Student not found", "error");
//     }

//     const payload = Object.entries(assignedTutors)
//       .filter(([, courseIds]) => Array.isArray(courseIds) && courseIds.length > 0)
//       .map(([tutorId, courseIds]) => ({
//         tutorId,
//         courseIds: courseIds.map((id) => String(id)),
//       }));

//     if (payload.length === 0) {
//       return showAlert("Select at least one tutor and one course", "error");
//     }

//     setSubmitting(true);

//     await api.post(`/admin/student/${getStudentId(assignStudent)}/assign-tutors`, {
//       assignments: payload,
//     });

//     showAlert("Assigned successfully", "success");

//     setAssignOpen(false);
//     setAssignStudent(null);
//     setSelectedTutor(null);
//     setCourseSelectOpen(false);
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to assign tutors"), "error");
//   } finally {
//     setSubmitting(false);
//   }
// }




//   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   return (
//     <div className="student-page" onClick={() => setMenuOpenId(null)}>
//       <div className="student-toolbar" onClick={(e) => e.stopPropagation()}>
//         <div className="student-search">
//           <span>⌕</span>
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search name, email, phone..."
//           />
//         </div>

//         <button
//           type="button"
//           className="student-invite-btn"
//           onClick={openInviteModal}
//         >
//           + Invite Student
//         </button>
//       </div>

//       {showOnlyNew && !loading && (
//         <div className="student-new-filter-note">
//           Showing students registered in the last 24 hours
//         </div>
//       )}

//       {loading ? (
//         <div className="student-state">Loading students...</div>
//       ) : filteredStudents.length === 0 ? (
//         <div className="student-state">
//           {showOnlyNew
//             ? "No new students registered in the last 24 hours"
//             : "No students found"}
//         </div>
//       ) : (
//         <div className="student-grid">
//           {filteredStudents.map((student, index) => {
//             const studentId = getStudentId(student);
//             const photoUrl = getStudentPhoto(student.photo);
//             const newStudent = isNewStudent(student);

//             return (
//               <article
//                 key={studentId}
//                 ref={newStudent && index === 0 ? firstNewCardRef : null}
//                 className={`student-card ${newStudent ? "student-card--new" : ""
//                   }`}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {newStudent && (
//                   <span className="student-new-badge">New 24h</span>
//                 )}

//                 <div className="student-menu-wrap">
//                   <button
//                     type="button"
//                     className="student-menu-btn"
//                     onClick={() =>
//                       setMenuOpenId(menuOpenId === studentId ? null : studentId)
//                     }
//                   >
//                     ⋮
//                   </button>

//                   {menuOpenId === studentId && (
//                     <div className="student-menu">
//                       <button
//                         type="button"
//                         onClick={() => openEditModal(student)}
//                       >
//                         ✎ Edit
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => askDeleteStudent(student)}
//                       >
//                         🗑 Delete Account
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="student-avatar">
//                   {photoUrl ? (
//                     <img src={photoUrl} alt={student.name || "Student"} />
//                   ) : (
//                     <span>{student.name?.charAt(0)?.toUpperCase() || "S"}</span>
//                   )}
//                 </div>

//                 <h3>{student.name || "Student"}</h3>

//                 <div className="student-card-details">
//                   <p>
//                     <b>Email:</b>{" "}
//                     <span>{student.email || "No email added"}</span>
//                   </p>

//                   <p>
//                     <b>Phone:</b>{" "}
//                     <span>{student.phone || "No phone added"}</span>
//                   </p>
//                 </div>




//                 <button
//                   type="button"
//                   className="student-assign-btn"
//                   onClick={() => openAssignTutorModal(student)}
//                 >
//                   Assign Tutors
//                 </button>





//               </article>
//             );
//           })}
//         </div>
//       )}

//       <Modal
//         open={inviteOpen}
//         title="Invite Student"
//         width="560px"
//         onClose={() => setInviteOpen(false)}
//       >
//         <form className="student-form" onSubmit={sendInvite}>
//           <label className="form-field">
//             <span>Student Name</span>
//             <input
//               value={inviteForm.name}
//               onChange={(e) =>
//                 setInviteForm((prev) => ({ ...prev, name: e.target.value }))
//               }
//               placeholder="Enter student name"
//             />
//           </label>

//           <label className="form-field">
//             <span>Student Email</span>
//             <input
//               type="email"
//               value={inviteForm.email}
//               onChange={(e) =>
//                 setInviteForm((prev) => ({ ...prev, email: e.target.value }))
//               }
//               placeholder="Enter student email"
//             />
//           </label>

//           <label className="form-field">
//             <span>Student Phone</span>
//             <input
//               type="tel"
//               value={inviteForm.phone}
//               onChange={(e) =>
//                 setInviteForm((prev) => ({ ...prev, phone: e.target.value }))
//               }
//               placeholder="Enter student phone"
//             />
//           </label>

//           <div className="form-actions">
//             <button
//               type="button"
//               className="secondary-btn"
//               onClick={() => setInviteOpen(false)}
//               disabled={submitting}
//             >
//               Cancel
//             </button>

//             <button type="submit" className="primary-btn" disabled={submitting}>
//               {submitting ? "Sending..." : "Send Mail"}
//             </button>
//           </div>
//         </form>
//       </Modal>

//       <Modal
//         open={editOpen}
//         title="Edit Student"
//         width="620px"
//         onClose={() => setEditOpen(false)}
//       >
//         <form className="student-form" onSubmit={updateStudent}>
//           <label className="form-field">
//             <span>Student Photo</span>
//             <input type="file" accept="image/*" onChange={handlePhotoChange} />
//           </label>

//           {preview && (
//             <div className="student-photo-preview">
//               <img src={preview} alt="Preview" />
//             </div>
//           )}

//           <label className="form-field">
//             <span>Name</span>
//             <input
//               value={editForm.name}
//               onChange={(e) =>
//                 setEditForm((prev) => ({ ...prev, name: e.target.value }))
//               }
//               placeholder="Enter student name"
//             />
//           </label>

//           <label className="form-field">
//             <span>Email</span>
//             <input
//               type="email"
//               value={editForm.email}
//               onChange={(e) =>
//                 setEditForm((prev) => ({ ...prev, email: e.target.value }))
//               }
//               placeholder="Enter student email"
//             />
//           </label>

//           <label className="form-field">
//             <span>Phone</span>
//             <input
//               type="tel"
//               value={editForm.phone}
//               onChange={(e) =>
//                 setEditForm((prev) => ({ ...prev, phone: e.target.value }))
//               }
//               placeholder="Enter student phone"
//             />
//           </label>

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
//         title="Delete Student Account"
//         width="440px"
//         onClose={() => setDeleteOpen(false)}
//       >
//         <div className="student-delete-box">
//           <p>
//             <b>{deleteTarget?.name || "This student"}</b> delete account?
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
//               onClick={deleteStudent}
//               disabled={submitting}
//             >
//               {submitting ? "Deleting..." : "Delete"}
//             </button>
//           </div>
//         </div>
//       </Modal>


//       <Modal
//         open={assignOpen}
//         title={`Assign Tutors${assignStudent?.name ? ` - ${assignStudent.name}` : ""}`}
//         width="760px"
//         // onClose={() => {
//         //   setAssignOpen(false);
//         //   setAssignStudent(null);
//         //   setAssignedTutorIds([]);
//         // }}


// onClose={() => {

//   setAssignOpen(false);

//   setAssignStudent(null);

//   setAssignedTutors({});

//   setSelectedTutor(null);

//   setCourseSelectOpen(false);

// }}


//       >





















//         <div className="assign-tutor-box">
//           <div className="assign-tutor-search">
//             <span>⌕</span>
//             <input
//               value={assignSearch}
//               onChange={(e) => setAssignSearch(e.target.value)}
//               placeholder="Search tutors..."
//             />
//           </div>

//           {assignLoading ? (
//             <div className="assign-tutor-state">Loading tutors...</div>
//           ) : filteredAssignTutors.length === 0 ? (
//             <div className="assign-tutor-state">No tutors found</div>
//           ) : (
//             <div className="assign-tutor-list">
//               {filteredAssignTutors.map((tutor) => {
//                 // const checked = assignedTutorIds.includes(tutor._id);

//                 const checked =
//                   assignedTutors[
//                   tutor._id
//                   ]

//                 const photo = tutor.photo ? getMediaUrl(tutor.photo) : "";

//                 return (
//               //     <label
//               //       key={tutor._id}
//               //       className={`assign-tutor-item ${checked ? "assign-tutor-item--selected" : ""
//               //         }`}
//               //     >
//               //       {/* <input
//               //   type="checkbox"
//               //   checked={checked}
//               //   onChange={(e) =>
//               //     toggleAssignedTutor(tutor._id, e.target.checked)
//               //   }
//               // /> */}



//               //       <input
//               //         type="checkbox"
//               //         checked={!!checked}

//               //         onChange={(e) =>

//               //           toggleAssignedTutor(
//               //             tutor,
//               //             e.target.checked
//               //           )

//               //         }
//               //       />



//               //       <div className="assign-tutor-avatar">
//               //         {photo ? (
//               //           <img src={photo} alt={tutor.name || "Tutor"} />
//               //         ) : (
//               //           <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
//               //         )}
//               //       </div>

//               //       <div className="assign-tutor-info">
//               //         <h4>{tutor.name || "Tutor"}</h4>
//               //         <p>{tutor.qualification || "Qualification not added"}</p>
//               //         <small>{tutor.email || tutor.phone || "No contact added"}</small>
//               //       </div>
//               //     </label>



// <label
//   key={tutor._id}
//   className={`assign-tutor-item ${
//     checked ? "assign-tutor-item--selected" : ""
//   }`}
// >
//   <input
//     type="checkbox"
//     checked={!!checked}
//     onChange={(e) =>
//       toggleAssignedTutor(
//         tutor,
//         e.target.checked
//       )
//     }
//   />

//   <div className="assign-tutor-avatar">
//     {photo ? (
//       <img src={photo} alt={tutor.name || "Tutor"} />
//     ) : (
//       <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
//     )}
//   </div>

//   <div className="assign-tutor-info">
//     <h4>{tutor.name || "Tutor"}</h4>
//     <p>{tutor.qualification || "Qualification not added"}</p>
//     <small>{tutor.email || tutor.phone || "No contact added"}</small>

//     {assignedTutors[tutor._id]?.length > 0 && (
//       <div className="assigned-course-preview">
//         Selected: {assignedTutors[tutor._id].length} course selected
//       </div>
//     )}
//   </div>
// </label>




//                 );
//               })}
//             </div>
//           )}

//           <div className="assign-tutor-actions">
//             <button
//               type="button"
//               className="secondary-btn"
//               onClick={() => setAssignOpen(false)}
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               className="primary-btn"
//               disabled={submitting}
//               onClick={saveAssignedTutors}
//             >
//               {submitting ? "Saving..." : "Save Assignment"}
//             </button>
//           </div>
//         </div>
//       </Modal>


//       <Modal
//         open={courseSelectOpen}
//         title={`${selectedTutor?.name} Courses`}
//         width="720px"
//         onClose={() => {

//           setCourseSelectOpen(false)

//           setSelectedTutor(null)

//         }}
//       >

//         <div className="course-select-box">

//           <button
//             className="back-course-btn"
//             onClick={() => {

//               setCourseSelectOpen(false)

//             }}
//           >

//             ← Back

//           </button>


//           <div className="course-list">

//             {

//               selectedTutor?.courseIds?.map(
//                 (course) => {

//                   const id =
//                     course?._id ||
//                     course;

//                   const checked =

//                     assignedTutors[
//                       selectedTutor._id
//                     ]?.includes(id)


//                   return (

//                     <label
//                       className="course-item"
//                       key={id}
//                     >

//                       <input
//                         type="checkbox"

//                         checked={checked}

//                         onChange={() =>

//                           toggleCourse(
//                             selectedTutor._id,
//                             id
//                           )

//                         }
//                       />

//                       <span>

//                         {

//                           course.name ||
//                           course.title

//                         }

//                       </span>

//                     </label>

//                   )

//                 }

//               )

//             }

//           </div>


// <div
// className="course-select-footer"
// >

// <button

// className="secondary-btn"

// onClick={()=>{

// setCourseSelectOpen(false)

// }}

// >

// Cancel

// </button>

// <button

// className="primary-btn"

// onClick={()=>{

// const selected=
// assignedTutors[
// selectedTutor._id
// ] || [];

// if(
// selected.length===0
// ){

// showAlert(
// "Select minimum one course",
// "error"
// );

// return;

// }

// setCourseSelectOpen(
// false
// )

// }}

// >

// Select

// </button>

// </div>



//         </div>

//       </Modal>



//     </div>
//   );
// }

















































import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";



import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../Components/Modal";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import api from "../api/axios";
import "./AdminStudentsPage.css";

const emptyInviteForm = {
  name: "",
  email: "",
  phone: "",
};

// const emptyEditForm = {
//   name: "",
//   email: "",
//   phone: "",
//   photo: "",
// };





const emptyEditForm = {
  name: "",
  email: "",
  phone: "",
  photo: "",
  photoFile: null,
};



function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function getStudentId(student) {
  return student?._id || student?.id;
}

function getStudentPhoto(photo) {
  if (!photo) return "";

  const src = String(photo).trim();

  if (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  return getMediaUrl(src);
}

function isNewStudent(student) {
  if (!student?.createdAt) return false;

  const createdTime = new Date(student.createdAt).getTime();
  if (Number.isNaN(createdTime)) return false;

  return Date.now() - createdTime <= 24 * 60 * 60 * 1000;
}







function isStudentBlocked(student) {

  return (
    student?.isBlocked === true ||
    student?.isBlocked === "true" ||
    student?.isBlocked === 1
  )

}













function StudentDarkModal({ open, title, width = "560px", onClose, children }) {
  if (!open) return null;

  return createPortal(
    <div className="student-dark-modal-overlay" onMouseDown={onClose}>
      <div
        className="student-dark-modal"
        style={{ width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="student-dark-modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="student-dark-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="student-dark-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}











function StudentInviteIcon() {
  return (
    <span className="student-invite-btn__icon" aria-hidden="true">
      <span className="student-invite-btn__plus">+</span>

      <svg
        className="student-invite-btn__user"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21c.8-4 3.6-6 7.5-6s6.7 2 7.5 6" />
      </svg>
    </span>
  );







}







export default function AdminStudentsPage() {
  const { showAlert } = useAlert();
  const location = useLocation();
  const navigate = useNavigate();
  const firstNewCardRef = useRef(null);

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState(emptyInviteForm);

  const [editOpen, setEditOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [preview, setPreview] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [submitting, setSubmitting] = useState(false);







  const [tutors, setTutors] = useState([]);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignStudent, setAssignStudent] = useState(null);
  const [assignedTutorIds, setAssignedTutorIds] = useState([]);
  const [assignSearch, setAssignSearch] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);






  const showOnlyNew =
    new URLSearchParams(location.search).get("filter") === "new";

  const filteredStudents = useMemo(() => {
    let result = students;

    if (showOnlyNew) {
      result = result.filter((student) => isNewStudent(student));
    }

    const q = search.toLowerCase().trim();

    if (!q) return result;

    return result.filter((student) => {
      return (
        String(student.name || "").toLowerCase().includes(q) ||
        String(student.email || "").toLowerCase().includes(q) ||
        String(student.phone || "").toLowerCase().includes(q)
      );
    });
  }, [students, search, showOnlyNew]);

  async function fetchStudents() {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/student/all");
      setStudents(data.students || []);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load students"), "error");
    } finally {
      setLoading(false);
    }
  }

async function openStudentChat(student) {
  try {
    const studentId = getStudentId(student);

    if (!studentId) {
      return showAlert("Student id not found", "error");
    }

    const { data } = await api.post(`/chat/admin-student-room/${studentId}`);

    const roomId = data?.room?._id || data?.chatRoom?._id || data?.roomId;

    if (roomId) {
      // navigate(`/admin/chats?roomId=${roomId}`);

navigate(`/admin/chats?roomId=${roomId}&open=chat`);


    } else {
      navigate("/admin/chats");
    }
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to open chat"), "error");
  }
}


  async function fetchTutors() {
    try {
      const { data } = await api.get("/admin/tuter/all");
      setTutors(data.tuters || []);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
    }
  }




  useEffect(() => {
    fetchStudents();
    fetchTutors();
  }, []);


  useEffect(() => {
    if (!loading && showOnlyNew && firstNewCardRef.current) {
      setTimeout(() => {
        firstNewCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 200);
    }
  }, [loading, showOnlyNew, filteredStudents.length]);

  function openInviteModal() {
    setInviteForm(emptyInviteForm);
    setInviteOpen(true);
  }

  async function sendInvite(e) {
    e.preventDefault();

    try {
      if (!inviteForm.name.trim()) {
        return showAlert("Student name required", "error");
      }

      if (!inviteForm.email.trim()) {
        return showAlert("Student email required", "error");
      }

      if (!inviteForm.phone.trim()) {
        return showAlert("Student phone required", "error");
      }

      setSubmitting(true);

      await api.post("/admin/student/invite", {
        name: inviteForm.name.trim(),
        email: inviteForm.email.trim(),
        phone: inviteForm.phone.trim(),
      });

      showAlert("Invite mail sent successfully", "success");
      setInviteOpen(false);
      setInviteForm(emptyInviteForm);
      fetchStudents();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to send invite"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  function openEditModal(student) {
    setEditingStudent(student);
    setEditForm({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      photo: student.photo || "",
      photoFile: null,
    });
    setPreview(getStudentPhoto(student.photo));
    setEditOpen(true);
    setMenuOpenId(null);
  }






  function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showAlert("Image size 5MB-il താഴെ ആയിരിക്കണം", "error");
      return;
    }

    setEditForm((prev) => ({
      ...prev,
      photo: URL.createObjectURL(file),
      photoFile: file,
    }));

    setPreview(URL.createObjectURL(file));
  }





  async function updateStudent(e) {
    e.preventDefault();

    try {
      if (!editingStudent) return;

      if (!editForm.name.trim()) {
        return showAlert("Student name required", "error");
      }

      if (!editForm.email.trim()) {
        return showAlert("Student email required", "error");
      }

      if (!editForm.phone.trim()) {
        return showAlert("Student phone required", "error");
      }

      setSubmitting(true);






      const formData = new FormData();
      formData.append("name", editForm.name.trim());
      formData.append("email", editForm.email.trim());
      formData.append("phone", editForm.phone.trim());

      if (editForm.photoFile) {
        formData.append("photo", editForm.photoFile);
      }

      await api.put(
        `/admin/student/update/${getStudentId(editingStudent)}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );






      showAlert("Student updated successfully", "success");
      setEditOpen(false);
      setEditingStudent(null);
      setEditForm(emptyEditForm);
      setPreview("");
      fetchStudents();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to update student"), "error");
    } finally {
      setSubmitting(false);
    }
  }

  function askDeleteStudent(student) {
    setDeleteTarget(student);
    setDeleteOpen(true);
    setMenuOpenId(null);
  }

  async function deleteStudent() {
    try {
      if (!deleteTarget) return;

      setSubmitting(true);

      await api.delete(`/admin/student/delete/${getStudentId(deleteTarget)}`);

      showAlert("Student account deleted successfully", "success");
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to delete student"), "error");
    } finally {
      setSubmitting(false);
    }
  }











  async function toggleStudentBlock(student) {

    try {

      const nextBlocked =
        !isStudentBlocked(student);

      const { data } = await api.patch(

        `/admin/student/block/${getStudentId(student)}`,

        {
          isBlocked: nextBlocked
        }

      );

      setStudents(prev =>

        prev.map(item =>

          getStudentId(item) ===
            getStudentId(student)

            ?

            {
              ...item,

              isBlocked:
                data?.student?.isBlocked
                ??

                nextBlocked

            }

            : item

        )

      )

      setMenuOpenId(null);

      showAlert(

        nextBlocked
          ?
          "Student blocked"
          :
          "Student unblocked",

        "success"

      )

    } catch (err) {

      showAlert(

        getErrorMessage(
          err,
          "Failed blocking student"
        ),

        "error"

      )

    }

  }













  const filteredAssignTutors = useMemo(() => {
    const q = assignSearch.toLowerCase().trim();

    if (!q) return tutors;

    return tutors.filter((tutor) => {
      return (
        String(tutor.name || "").toLowerCase().includes(q) ||
        String(tutor.email || "").toLowerCase().includes(q) ||
        String(tutor.phone || "").toLowerCase().includes(q) ||
        String(tutor.qualification || "").toLowerCase().includes(q)
      );
    });
  }, [tutors, assignSearch]);

  async function openAssignTutorModal(student) {
    try {
      setAssignStudent(student);
      setAssignedTutorIds([]);
      setAssignSearch("");
      setAssignOpen(true);
      setMenuOpenId(null);
      setAssignLoading(true);

      const { data } = await api.get(
        `/admin/student/${getStudentId(student)}/assigned-tutors`
      );

      const ids = (data.tutors || []).map((tutor) => tutor._id);
      setAssignedTutorIds(ids);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load assigned tutors"), "error");
    } finally {
      setAssignLoading(false);
    }
  }

  function toggleAssignedTutor(tutorId, checked) {
    setAssignedTutorIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, tutorId]));
      }

      return prev.filter((id) => id !== tutorId);
    });
  }

  async function saveAssignedTutors() {
    try {
      if (!assignStudent) return;

      setSubmitting(true);

      await api.post(`/admin/student/${getStudentId(assignStudent)}/assign-tutors`, {
        tutorIds: assignedTutorIds,
      });

      showAlert("Tutors assigned successfully", "success");
      setAssignOpen(false);
      setAssignStudent(null);
      setAssignedTutorIds([]);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to assign tutors"), "error");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="student-page" onClick={() => setMenuOpenId(null)}>
      <div className="student-toolbar" onClick={(e) => e.stopPropagation()}>
        <div className="student-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone..."
          />
        </div>





        <button
          type="button"
          className="student-invite-btn"
          onClick={openInviteModal}
          aria-label="Invite Student"
        >
          <StudentInviteIcon />
          <span className="student-invite-btn__text">Invite Student</span>
        </button>



      </div>

      {showOnlyNew && !loading && (
        <div className="student-new-filter-note">
          Showing students registered in the last 24 hours
        </div>
      )}

      {loading ? (
        <div className="student-state">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="student-state">
          {showOnlyNew
            ? "No new students registered in the last 24 hours"
            : "No students found"}
        </div>
      ) : (
        <div className="student-grid">
          {filteredStudents.map((student, index) => {
            const studentId = getStudentId(student);
            const photoUrl = getStudentPhoto(student.photo);
            const newStudent = isNewStudent(student);

            return (
              <article
                key={studentId}
                ref={newStudent && index === 0 ? firstNewCardRef : null}





                className={`student-card

${newStudent
                    ?
                    "student-card--new"
                    :
                    ""
                  }

${isStudentBlocked(student)
                    ?
                    "student-card--blocked"
                    :
                    ""
                  }
`}







              >






                {
                  isStudentBlocked(student)

                    ?

                    <span className="student-blocked-badge">

                      Blocked

                    </span>

                    :

                    newStudent && (

                      <span className="student-new-badge">

                        New 24h

                      </span>

                    )

                }








                <div className="student-menu-wrap">
                  <button
                    type="button"
                    className="student-menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === studentId ? null : studentId);
                    }}
                  >
                    ⋮
                  </button>

                  {menuOpenId === studentId && (
                    <div
                      className="student-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => openEditModal(student)}
                      >
                        ✎ Edit
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          toggleStudentBlock(
                            student
                          )
                        }
                      >

                        {
                          isStudentBlocked(
                            student
                          )

                            ?

                            "◯ Unblock"

                            :

                            "⊘ Block"

                        }

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          askDeleteStudent(
                            student
                          )
                        }
                      >

                        🗑 Delete Account

                      </button>

                    </div>








                  )}
                </div>

                <div className="student-avatar">
                  {photoUrl ? (
                    <img src={photoUrl} alt={student.name || "Student"} />
                  ) : (
                    <span>{student.name?.charAt(0)?.toUpperCase() || "S"}</span>
                  )}
                </div>

                <h3>{student.name || "Student"}</h3>

                <div className="student-card-details">
                  <p>
                    <b>Email:</b>{" "}
                    <span>{student.email || "No email added"}</span>
                  </p>

                  <p>
                    <b>Phone:</b>{" "}
                    <span>{student.phone || "No phone added"}</span>
                  </p>
                </div>




            <div className="student-card-actions">
  <button
    type="button"
    className="student-chat-btn"
    onClick={() => openStudentChat(student)}
  >
    Chat
  </button>

  <button
    type="button"
    className="student-assign-btn"
    onClick={() => openAssignModal(student)}
  >
    Assign Tutors
  </button>
</div>





              </article>
            );
          })}
        </div>
      )}









      <StudentDarkModal
        open={inviteOpen}
        title="Invite Student"
        width="560px"
        onClose={() => setInviteOpen(false)}
      >
        <form className="student-form student-dark-form" onSubmit={sendInvite}>
          <label className="form-field">
            <span>Student Name</span>
            <input
              value={inviteForm.name}
              onChange={(e) =>
                setInviteForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter student name"
            />
          </label>

          <label className="form-field">
            <span>Student Email</span>
            <input
              type="email"
              value={inviteForm.email}
              onChange={(e) =>
                setInviteForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter student email"
            />
          </label>

          <label className="form-field">
            <span>Student Phone</span>
            <input
              type="tel"
              value={inviteForm.phone}
              onChange={(e) =>
                setInviteForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Enter student phone"
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setInviteOpen(false)}
              disabled={submitting}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Sending..." : "Send Mail"}
            </button>
          </div>
        </form>
      </StudentDarkModal>










      <StudentDarkModal
        open={editOpen}
        title="Edit Student"
        width="620px"
        onClose={() => setEditOpen(false)}
      >
        <form className="student-form student-dark-form" onSubmit={updateStudent}>
          <label className="form-field">
            <span>Student Photo</span>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>

          {preview && (
            <div className="student-photo-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <label className="form-field">
            <span>Name</span>
            <input
              value={editForm.name}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter student name"
            />
          </label>

          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter student email"
            />
          </label>

          <label className="form-field">
            <span>Phone</span>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="Enter student phone"
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
      </StudentDarkModal>












      <StudentDarkModal
        open={deleteOpen}
        title="Delete Student Account"
        width="460px"
        onClose={() => setDeleteOpen(false)}
      >
        <div className="student-delete-box student-dark-delete-box">
          <p>
            <b>{deleteTarget?.name || "This student"}</b> Do you want to delete this
            student?
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
              onClick={deleteStudent}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </StudentDarkModal>











      <StudentDarkModal
        open={assignOpen}
        title={`Assign Tutors${assignStudent?.name ? ` - ${assignStudent.name}` : ""}`}
        width="760px"
        onClose={() => {
          setAssignOpen(false);
          setAssignStudent(null);
          setAssignedTutorIds([]);
        }}
      >
        <div className="assign-tutor-box assign-tutor-box-dark">
          <div className="assign-tutor-search assign-tutor-search-dark">
            <span>⌕</span>
            <input
              value={assignSearch}
              onChange={(e) => setAssignSearch(e.target.value)}
              placeholder="Search tutors..."
            />
          </div>

          {assignLoading ? (
            <div className="assign-tutor-state assign-tutor-state-dark">
              Loading tutors...
            </div>
          ) : filteredAssignTutors.length === 0 ? (
            <div className="assign-tutor-state assign-tutor-state-dark">
              No tutors found
            </div>
          ) : (
            <div className="assign-tutor-list assign-tutor-list-dark">
              {filteredAssignTutors.map((tutor) => {
                const checked = assignedTutorIds.includes(tutor._id);
                const photo = tutor.photo ? getMediaUrl(tutor.photo) : "";

                return (
                  <label
                    key={tutor._id}
                    className={`assign-tutor-item assign-tutor-item-dark ${checked ? "assign-tutor-item--selected" : ""
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        toggleAssignedTutor(tutor._id, e.target.checked)
                      }
                    />

                    <div className="assign-tutor-avatar">
                      {photo ? (
                        <img src={photo} alt={tutor.name || "Tutor"} />
                      ) : (
                        <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
                      )}
                    </div>

                    <div className="assign-tutor-info assign-tutor-info-dark">
                      <h4>{tutor.name || "Tutor"}</h4>
                      <p>{tutor.qualification || "Qualification not added"}</p>
                      <small>
                        {tutor.email || tutor.phone || "No contact added"}
                      </small>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          <div className="assign-tutor-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setAssignOpen(false);
                setAssignStudent(null);
                setAssignedTutorIds([]);
              }}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="primary-btn"
              disabled={submitting}
              onClick={saveAssignedTutors}
            >
              {submitting ? "Saving..." : "Save Assignment"}
            </button>
          </div>
        </div>
      </StudentDarkModal>







    </div>
  );
}