// import React, { useEffect, useMemo, useState } from "react";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import "./TutorTutorsPage.css";

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
//     <div className="tutor-tutor-stars">
//       {[1, 2, 3, 4, 5].map((n) => (
//         <span
//           key={n}
//           className={n <= rounded ? "tutor-star filled" : "tutor-star"}
//         >
//           ★
//         </span>
//       ))}
//       <b>{fixedRating.toFixed(1)}</b>
//     </div>
//   );
// }

// function getSubjects(tutor) {
//   if (Array.isArray(tutor.subjects)) return tutor.subjects.join(", ");
//   return tutor.subjects || "Subject not added";
// }

// function getLoggedInUser() {
//   try {
//     return JSON.parse(localStorage.getItem("user") || "{}");
//   } catch {
//     return {};
//   }
// }

// function isCurrentTutor(tutor, user) {
//   const userId = user?.id || user?._id;
//   const userEmail = String(user?.email || "").toLowerCase().trim();
//   const tutorEmail = String(tutor?.email || "").toLowerCase().trim();

//   const tutorLoginUserId =
//     typeof tutor?.loginUserId === "object"
//       ? tutor?.loginUserId?._id
//       : tutor?.loginUserId;

//   return (
//     (userId && String(tutorLoginUserId) === String(userId)) ||
//     (userEmail && tutorEmail && userEmail === tutorEmail)
//   );
// }

// export default function TutorTutorsPage() {
//   const { showAlert } = useAlert();

//   const [tutors, setTutors] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const loggedUser = useMemo(() => getLoggedInUser(), []);

//   async function fetchTutors() {
//     try {
//       setLoading(true);

//       const { data } = await api.get("/tuter/all");
//       const tutorList = data.tuters || [];

//       const sortedTutors = [...tutorList].sort((a, b) => {
//         const aIsMe = isCurrentTutor(a, loggedUser);
//         const bIsMe = isCurrentTutor(b, loggedUser);

//         if (aIsMe && !bIsMe) return -1;
//         if (!aIsMe && bIsMe) return 1;

//         return 0;
//       });

//       setTutors(sortedTutors);
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchTutors();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const filteredTutors = useMemo(() => {
//     const q = search.toLowerCase().trim();

//     if (!q) return tutors;

//     return tutors.filter((tutor) => {
//       return (
//         String(tutor.name || "").toLowerCase().includes(q) ||
//         String(getSubjects(tutor)).toLowerCase().includes(q) ||
//         String(tutor.qualification || "").toLowerCase().includes(q) ||
//         String(tutor.about || "").toLowerCase().includes(q)
//       );
//     });
//   }, [tutors, search]);

//   return (
//     <div className="tutor-tutors-page">
//       <div className="tutor-tutor-toolbar">
//         <div className="tutor-tutor-search">
//           <span>⌕</span>
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search tutors..."
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="tutor-tutor-state">Loading tutors...</div>
//       ) : filteredTutors.length === 0 ? (
//         <div className="tutor-tutor-state">No tutors found</div>
//       ) : (
//         <div className="tutor-tutor-grid">
//           {filteredTutors.map((tutor) => {
//             const currentTutor = isCurrentTutor(tutor, loggedUser);

//             return (
//               <article
//                 className={`tutor-tutor-card ${
//                   currentTutor ? "tutor-tutor-card--me" : ""
//                 }`}
//                 key={tutor._id}
//               >
//                 {currentTutor ? (
//                   <span className="tutor-me-badge">You</span>
//                 ) : null}

//                 <div className="tutor-tutor-card-top">
//                   <div className="tutor-tutor-avatar">
//                     {tutor.photo ? (
//                       <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
//                     ) : (
//                       <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
//                     )}
//                   </div>

//                   <div className="tutor-tutor-info">
//                     <h3>{tutor.name || "Tutor"}</h3>
//                     <p>{tutor.qualification || "Qualification not added"}</p>
//                   </div>
//                 </div>

//                 <p className="tutor-tutor-about">
//                   {tutor.about || "No description added"}
//                 </p>

//                 <Stars rating={tutor.averageRating} />

//                 <button
//                   type="button"
//                   className="tutor-view-details-btn"
//                   onClick={() => {}}
//                 >
//                   View Details
//                 </button>
//               </article>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }





























































// import React, { useEffect, useMemo, useState } from "react";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import "./TutorTutorsPage.css";

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
//     <div className="tutor-tutor-stars">
//       {[1, 2, 3, 4, 5].map((n) => (
//         <span
//           key={n}
//           className={n <= rounded ? "tutor-star filled" : "tutor-star"}
//         >
//           ★
//         </span>
//       ))}
//       <b>{fixedRating.toFixed(1)}</b>
//     </div>
//   );
// }

// function getSubjects(tutor) {
//   if (Array.isArray(tutor.subjects)) return tutor.subjects.join(", ");
//   return tutor.subjects || "Subject not added";
// }

// function getLoggedInUser() {
//   try {
//     return JSON.parse(localStorage.getItem("user") || "{}");
//   } catch {
//     return {};
//   }
// }

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

// function isCurrentTutor(tutor, user) {
//   const userId = user?.id || user?._id;
//   const userEmail = String(user?.email || "").toLowerCase().trim();
//   const tutorEmail = String(tutor?.email || "").toLowerCase().trim();

//   const tutorLoginUserId =
//     typeof tutor?.loginUserId === "object"
//       ? tutor?.loginUserId?._id
//       : tutor?.loginUserId;

//   return (
//     (userId && String(tutorLoginUserId) === String(userId)) ||
//     (userEmail && tutorEmail && userEmail === tutorEmail)
//   );
// }

// export default function TutorTutorsPage() {
//   const { showAlert } = useAlert();

//   const [tutors, setTutors] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const loggedUser = useMemo(() => getLoggedInUser(), []);

//   async function fetchTutors() {
//     try {
//       setLoading(true);

//       const { data } = await api.get("/tuter/all");
//       const tutorList = data.tuters || [];

//       const visibleTutors = tutorList.filter((tutor) => {
//         const currentTutor = isCurrentTutor(tutor, loggedUser);

//         if (isTutorBlocked(tutor)) return false;

//         if (currentTutor) return true;

//         return isTutorActive(tutor);
//       });

//       const sortedTutors = [...visibleTutors].sort((a, b) => {
//         const aIsMe = isCurrentTutor(a, loggedUser);
//         const bIsMe = isCurrentTutor(b, loggedUser);

//         if (aIsMe && !bIsMe) return -1;
//         if (!aIsMe && bIsMe) return 1;

//         return 0;
//       });

//       setTutors(sortedTutors);
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchTutors();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const filteredTutors = useMemo(() => {
//     const q = search.toLowerCase().trim();

//     if (!q) return tutors;

//     return tutors.filter((tutor) => {
//       return (
//         String(tutor.name || "").toLowerCase().includes(q) ||
//         String(getSubjects(tutor)).toLowerCase().includes(q) ||
//         String(tutor.qualification || "").toLowerCase().includes(q) ||
//         String(tutor.about || "").toLowerCase().includes(q)
//       );
//     });
//   }, [tutors, search]);

//   return (
//     <div className="tutor-tutors-page">
//       <div className="tutor-tutor-toolbar">
//         <div className="tutor-tutor-search">
//           <span>⌕</span>

//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search tutors..."
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="tutor-tutor-state">Loading tutors...</div>
//       ) : filteredTutors.length === 0 ? (
//         <div className="tutor-tutor-state">No tutors found</div>
//       ) : (
//         <div className="tutor-tutor-grid">
//           {filteredTutors.map((tutor) => {
//             const currentTutor = isCurrentTutor(tutor, loggedUser);
//             const currentTutorInactive = currentTutor && !isTutorActive(tutor);

//             return (
//               <article
//                 className={`tutor-tutor-card ${
//                   currentTutor ? "tutor-tutor-card--me" : ""
//                 } ${
//                   currentTutorInactive ? "tutor-tutor-card--me-inactive" : ""
//                 }`}
//                 key={tutor._id}
//               >
//                 {currentTutor ? (
//                   <span className="tutor-me-badge">You</span>
//                 ) : null}

//                 {currentTutorInactive ? (
//                   <span className="tutor-me-inactive-badge">Inactive</span>
//                 ) : null}

//                 <div className="tutor-tutor-card-top">
//                   <div className="tutor-tutor-avatar">
//                     {tutor.photo ? (
//                       <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
//                     ) : (
//                       <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
//                     )}
//                   </div>

//                   <div className="tutor-tutor-info">
//                     <h3>{tutor.name || "Tutor"}</h3>
//                     <p>{tutor.qualification || "Qualification not added"}</p>
//                   </div>
//                 </div>

//                 <p className="tutor-tutor-about">
//                   {tutor.about || "No description added"}
//                 </p>

//                 <Stars rating={tutor.averageRating} />

//                 <button
//                   type="button"
//                   className="tutor-view-details-btn"
//                   onClick={() => {}}
//                 >
//                   View Details
//                 </button>
//               </article>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }



















































// import React, { useEffect, useMemo, useState } from "react";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import "./TutorTutorsPage.css";

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
//     <div className="tutor-tutor-stars">
//       {[1, 2, 3, 4, 5].map((n) => (
//         <span
//           key={n}
//           className={n <= rounded ? "tutor-star filled" : "tutor-star"}
//         >
//           ★
//         </span>
//       ))}
//       <b>{fixedRating.toFixed(1)}</b>
//     </div>
//   );
// }

// function getSubjects(tutor) {
//   if (Array.isArray(tutor.subjects)) return tutor.subjects.join(", ");
//   return tutor.subjects || "Subject not added";
// }

// function getLoggedInUser() {
//   try {
//     return JSON.parse(localStorage.getItem("user") || "{}");
//   } catch {
//     return {};
//   }
// }

// function isTutorActive(tutor) {
//   return tutor?.isActive === true || tutor?.isActive === "true" || tutor?.isActive === 1;
// }

// function isTutorBlocked(tutor) {
//   return tutor?.isBlocked === true || tutor?.isBlocked === "true" || tutor?.isBlocked === 1;
// }

// function isCurrentTutor(tutor, user) {
//   const userId = user?.id || user?._id;
//   const userEmail = String(user?.email || "").toLowerCase().trim();
//   const tutorEmail = String(tutor?.email || "").toLowerCase().trim();

//   const tutorLoginUserId =
//     typeof tutor?.loginUserId === "object"
//       ? tutor?.loginUserId?._id
//       : tutor?.loginUserId;

//   return (
//     (userId && String(tutorLoginUserId) === String(userId)) ||
//     (userEmail && tutorEmail && userEmail === tutorEmail)
//   );
// }

// export default function TutorTutorsPage() {
//   const { showAlert } = useAlert();

//   const [tutors, setTutors] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const loggedUser = useMemo(() => getLoggedInUser(), []);

//   useEffect(() => {
//     let alive = true;

//     async function fetchTutors() {
//       try {
//         setLoading(true);

//         const { data } = await api.get("/tuter/all");
//         const tutorList = data?.tuters || [];

//         const visibleTutors = tutorList.filter((tutor) => {
//           const currentTutor = isCurrentTutor(tutor, loggedUser);

//           if (isTutorBlocked(tutor)) return false;
//           if (currentTutor) return true;

//           return isTutorActive(tutor);
//         });

//         // const sortedTutors = [...visibleTutors].sort((a, b) => {
//         //   const aIsMe = isCurrentTutor(a, loggedUser);
//         //   const bIsMe = isCurrentTutor(b, loggedUser);

//         //   if (aIsMe && !bIsMe) return -1;
//         //   if (!aIsMe && bIsMe) return 1;

//         //   return 0;
//         // });






// const sortedTutors = [...visibleTutors].sort((a, b) => {
//   const aIsMe = isCurrentTutor(a, loggedUser);
//   const bIsMe = isCurrentTutor(b, loggedUser);

//   if (aIsMe && !bIsMe) return -1;
//   if (!aIsMe && bIsMe) return 1;

//   return 0;
// });






//         if (alive) {
//           setTutors(sortedTutors);
//         }
//       } catch (err) {
//         if (alive) {
//           showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
//         }
//       } finally {
//         if (alive) {
//           setLoading(false);
//         }
//       }
//     }

//     fetchTutors();

//     return () => {
//       alive = false;
//     };
//   }, []);

//   const filteredTutors = useMemo(() => {
//     const q = search.toLowerCase().trim();

//     if (!q) return tutors;

//     return tutors.filter((tutor) => {
//       return (
//         String(tutor.name || "").toLowerCase().includes(q) ||
//         String(getSubjects(tutor)).toLowerCase().includes(q) ||
//         String(tutor.qualification || "").toLowerCase().includes(q) ||
//         String(tutor.about || "").toLowerCase().includes(q)
//       );
//     });
//   }, [tutors, search]);

//   return (
//     <div className="tutor-tutors-page">
//       <div className="tutor-tutor-toolbar">
//         <div className="tutor-tutor-search">
//           <span>⌕</span>
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search tutors..."
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="tutor-tutor-state">Loading tutors...</div>
//       ) : filteredTutors.length === 0 ? (
//         <div className="tutor-tutor-state">No tutors found</div>
//       ) : (
//         <div className="tutor-tutor-grid">
//           {filteredTutors.map((tutor) => {
//             const currentTutor = isCurrentTutor(tutor, loggedUser);
//             const currentTutorInactive = currentTutor && !isTutorActive(tutor);

//             return (
//               <article
//                 className={`tutor-tutor-card ${
//                   currentTutor ? "tutor-tutor-card--me" : ""
//                 } ${
//                   currentTutorInactive ? "tutor-tutor-card--me-inactive" : ""
//                 }`}
//                 key={tutor._id}
//               >
//                 {currentTutor ? <span className="tutor-me-badge">You</span> : null}
//                 {currentTutorInactive ? (
//                   <span className="tutor-me-inactive-badge">Inactive</span>
//                 ) : null}

//                 <div className="tutor-tutor-card-top">
//                   <div className="tutor-tutor-avatar">
//                     {tutor.photo ? (
//                       <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
//                     ) : (
//                       <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
//                     )}
//                   </div>

//                   <div className="tutor-tutor-info">
//                     <h3>{tutor.name || "Tutor"}</h3>
//                     <p>{tutor.qualification || "Qualification not added"}</p>
//                   </div>
//                 </div>

//                 <p className="tutor-tutor-about">
//                   {tutor.about || "No description added"}
//                 </p>

//                 <Stars rating={tutor.averageRating} />

//                 <button
//                   type="button"
//                   className="tutor-view-details-btn"
//                   onClick={() => {}}
//                 >
//                   View Details
//                 </button>
//               </article>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }



































// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import "./TutorTutorsPage.css";

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
//     <div className="tutor-tutor-stars">
//       {[1, 2, 3, 4, 5].map((n) => (
//         <span
//           key={n}
//           className={n <= rounded ? "tutor-star filled" : "tutor-star"}
//         >
//           ★
//         </span>
//       ))}
//       <b>{fixedRating.toFixed(1)}</b>
//     </div>
//   );
// }

// function getSubjects(tutor) {
//   if (Array.isArray(tutor.subjects)) return tutor.subjects.join(", ");
//   return tutor.subjects || "Subject not added";
// }

// function getLoggedInUser() {
//   try {
//     return JSON.parse(localStorage.getItem("user") || "{}");
//   } catch {
//     return {};
//   }
// }

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

// function isCurrentTutor(tutor, user) {
//   const userId = user?.id || user?._id;
//   const userEmail = String(user?.email || "").toLowerCase().trim();
//   const tutorEmail = String(tutor?.email || "").toLowerCase().trim();

//   const tutorLoginUserId =
//     typeof tutor?.loginUserId === "object"
//       ? tutor?.loginUserId?._id
//       : tutor?.loginUserId;

//   return (
//     (userId && String(tutorLoginUserId) === String(userId)) ||
//     (userEmail && tutorEmail && userEmail === tutorEmail)
//   );
// }

// export default function TutorTutorsPage() {
//   const navigate = useNavigate();
//   const { showAlert } = useAlert();

//   const [tutors, setTutors] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const loggedUser = useMemo(() => getLoggedInUser(), []);

//   useEffect(() => {
//     let alive = true;

//     async function fetchTutors() {
//       try {
//         setLoading(true);

//         const { data } = await api.get("/tuter/all");
//         const tutorList = data?.tuters || [];

//         const visibleTutors = tutorList.filter((tutor) => {
//           const currentTutor = isCurrentTutor(tutor, loggedUser);

//           if (isTutorBlocked(tutor)) return false;
//           if (currentTutor) return true;

//           return isTutorActive(tutor);
//         });

//         const sortedTutors = [...visibleTutors].sort((a, b) => {
//           const aIsMe = isCurrentTutor(a, loggedUser);
//           const bIsMe = isCurrentTutor(b, loggedUser);

//           if (aIsMe && !bIsMe) return -1;
//           if (!aIsMe && bIsMe) return 1;

//           return 0;
//         });

//         if (alive) {
//           setTutors(sortedTutors);
//         }
//       } catch (err) {
//         if (alive) {
//           showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
//         }
//       } finally {
//         if (alive) {
//           setLoading(false);
//         }
//       }
//     }

//     fetchTutors();

//     return () => {
//       alive = false;
//     };
//   }, [loggedUser, showAlert]);

//   const filteredTutors = useMemo(() => {
//     const q = search.toLowerCase().trim();

//     if (!q) return tutors;

//     return tutors.filter((tutor) => {
//       return (
//         String(tutor.name || "").toLowerCase().includes(q) ||
//         String(getSubjects(tutor)).toLowerCase().includes(q) ||
//         String(tutor.qualification || "").toLowerCase().includes(q) ||
//         String(tutor.about || "").toLowerCase().includes(q)
//       );
//     });
//   }, [tutors, search]);

//   return (
//     <div className="tutor-tutors-page">
//       <div className="tutor-tutor-toolbar">
//         <div className="tutor-tutor-search">
//           <span>⌕</span>
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search tutors..."
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="tutor-tutor-state">Loading tutors...</div>
//       ) : filteredTutors.length === 0 ? (
//         <div className="tutor-tutor-state">No tutors found</div>
//       ) : (
//         <div className="tutor-tutor-grid">
//           {filteredTutors.map((tutor) => {
//             const currentTutor = isCurrentTutor(tutor, loggedUser);
//             const currentTutorInactive = currentTutor && !isTutorActive(tutor);

//             return (
//               <article
//                 className={`tutor-tutor-card ${
//                   currentTutor ? "tutor-tutor-card--me" : ""
//                 } ${
//                   currentTutorInactive ? "tutor-tutor-card--me-inactive" : ""
//                 }`}
//                 key={tutor._id}
//               >
//                 {currentTutor ? (
//                   <span className="tutor-me-badge">You</span>
//                 ) : null}

//                 {currentTutorInactive ? (
//                   <span className="tutor-me-inactive-badge">Inactive</span>
//                 ) : null}

//                 <div className="tutor-tutor-card-top">
//                   <div className="tutor-tutor-avatar">
//                     {tutor.photo ? (
//                       <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
//                     ) : (
//                       <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
//                     )}
//                   </div>

//                   <div className="tutor-tutor-info">
//                     <h3>{tutor.name || "Tutor"}</h3>
//                     <p>{tutor.qualification || "Qualification not added"}</p>
//                   </div>
//                 </div>

//                 <p className="tutor-tutor-about">
//                   {tutor.about || "No description added"}
//                 </p>

//                 <Stars rating={tutor.averageRating} />

//                 <button
//                   type="button"
//                   className="tutor-view-details-btn"
//                   onClick={() => {
//                     const backData = {
//                       backTo: "/tutor/tutors",
//                       backButtonLabel: "Tutors",
//                       backLabel: "View details",
//                     };

//                     sessionStorage.setItem(
//                       "tutorTutorBackData",
//                       JSON.stringify(backData)
//                     );

//                     navigate(`/tutor/tutors/${tutor._id}`, {
//                       state: backData,
//                     });
//                   }}
//                 >
//                   View Details
//                 </button>
//               </article>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


















import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import "./TutorTutorsPage.css";

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
    <div className="tutor-tutor-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= rounded ? "tutor-star filled" : "tutor-star"}
        >
          ★
        </span>
      ))}
      <b>{fixedRating.toFixed(1)}</b>
    </div>
  );
}

function getSubjects(tutor) {
  if (Array.isArray(tutor.subjects)) return tutor.subjects.join(", ");
  return tutor.subjects || "Subject not added";
}

function getLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

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

function isCurrentTutor(tutor, user) {
  const userId = user?.id || user?._id;
  const userEmail = String(user?.email || "").toLowerCase().trim();
  const tutorEmail = String(tutor?.email || "").toLowerCase().trim();

  const tutorLoginUserId =
    typeof tutor?.loginUserId === "object"
      ? tutor?.loginUserId?._id
      : tutor?.loginUserId;

  return (
    (userId && String(tutorLoginUserId) === String(userId)) ||
    (userEmail && tutorEmail && userEmail === tutorEmail)
  );
}

export default function TutorTutorsPage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loggedUser = useMemo(() => getLoggedInUser(), []);

  useEffect(() => {
    let alive = true;

    async function fetchTutors() {
      try {
        setLoading(true);

        const { data } = await api.get("/tuter/all");
        const tutorList = data?.tuters || [];

        const visibleTutors = tutorList.filter((tutor) => {
          const currentTutor = isCurrentTutor(tutor, loggedUser);

          if (isTutorBlocked(tutor)) return false;
          if (currentTutor) return true;

          return isTutorActive(tutor);
        });

        const sortedTutors = [...visibleTutors].sort((a, b) => {
          const aIsMe = isCurrentTutor(a, loggedUser);
          const bIsMe = isCurrentTutor(b, loggedUser);

          if (aIsMe && !bIsMe) return -1;
          if (!aIsMe && bIsMe) return 1;

          return 0;
        });

        if (alive) {
          setTutors(sortedTutors);
        }
      } catch (err) {
        if (alive) {
          showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    fetchTutors();

    return () => {
      alive = false;
    };
  }, []);

  const filteredTutors = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return tutors;

    return tutors.filter((tutor) => {
      return (
        String(tutor.name || "").toLowerCase().includes(q) ||
        String(getSubjects(tutor)).toLowerCase().includes(q) ||
        String(tutor.qualification || "").toLowerCase().includes(q) ||
        String(tutor.about || "").toLowerCase().includes(q)
      );
    });
  }, [tutors, search]);

  return (
    <div className="tutor-tutors-page">
      <div className="tutor-tutor-toolbar">
        <div className="tutor-tutor-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutors..."
          />
        </div>
      </div>

      {loading ? (
        <div className="tutor-tutor-state">Loading tutors...</div>
      ) : filteredTutors.length === 0 ? (
        <div className="tutor-tutor-state">No tutors found</div>
      ) : (
        <div className="tutor-tutor-grid">
          {filteredTutors.map((tutor) => {
            const currentTutor = isCurrentTutor(tutor, loggedUser);
            const currentTutorInactive = currentTutor && !isTutorActive(tutor);

            return (
              <article
                className={`tutor-tutor-card ${
                  currentTutor ? "tutor-tutor-card--me" : ""
                } ${
                  currentTutorInactive ? "tutor-tutor-card--me-inactive" : ""
                }`}
                key={tutor._id}
              >
                {currentTutor ? (
                  <span className="tutor-me-badge">You</span>
                ) : null}

                {currentTutorInactive ? (
                  <span className="tutor-me-inactive-badge">Inactive</span>
                ) : null}

                <div className="tutor-tutor-card-top">
                  <div className="tutor-tutor-avatar">
                    {tutor.photo ? (
                      <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
                    ) : (
                      <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
                    )}
                  </div>

                  <div className="tutor-tutor-info">
                    <h3>{tutor.name || "Tutor"}</h3>
                    <p>{tutor.qualification || "Qualification not added"}</p>
                  </div>
                </div>

                <p className="tutor-tutor-about">
                  {tutor.about || "No description added"}
                </p>

                <Stars rating={tutor.averageRating} />

                <button
                  type="button"
                  className="tutor-view-details-btn"
                  onClick={() => {
                    const backData = {
                      backTo: "/tutor/tutors",
                      backButtonLabel: "Tutors",
                      backLabel: "View details",
                    };

                    sessionStorage.setItem(
                      "tutorTutorBackData",
                      JSON.stringify(backData)
                    );

                    navigate(`/tutor/tutors/${tutor._id}`, {
                      state: backData,
                    });
                  }}
                >
                  View Details
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}