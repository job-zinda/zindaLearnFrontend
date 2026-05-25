// import React from "react";
// import "./TutorPlaceholderPage.css";

// export default function TutorHomePage() {
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   return (
//     <div className="tutor-placeholder-page">
//       <div className="tutor-placeholder-card">
//         <span className="tutor-placeholder-badge">Tutor Panel</span>

//         <h2>Welcome Tutor</h2>

//         <p>
//           Hello <b>{user?.name || "Tutor"}</b>, you have successfully logged in.
//         </p>

//         <div className="tutor-placeholder-info">
//           <span>Email</span>
//           <strong>{user?.email || "No email"}</strong>
//         </div>

//         <div className="tutor-placeholder-info">
//           <span>Phone</span>
//           <strong>{user?.phone || "No phone"}</strong>
//         </div>
//       </div>
//     </div>
//   );
// }
































// import React, { useEffect, useMemo, useState } from "react";
// import TutorBannerSection from "../Components/TutorBannerSection";
// import TutorCategorySection from "../Components/TutorCategorySection";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import "./TutorHomePage.css";

// function getStudent(feedback) {
//   return feedback?.studentId || {};
// }

// function getPhotoSrc(photo) {
//   if (!photo) return "";

//   const src = String(photo).trim();

//   if (
//     src.startsWith("data:image") ||
//     src.startsWith("blob:") ||
//     src.startsWith("http://") ||
//     src.startsWith("https://")
//   ) {
//     return src;
//   }

//   return src;
// }

// function Stars({ rating }) {
//   const value = Math.round(Number(rating) || 0);

//   return (
//     <div className="tutor-home-feedback-stars">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <span key={star} className={star <= value ? "filled" : ""}>
//           ★
//         </span>
//       ))}
//     </div>
//   );
// }

// function TutorStudentAvatar({ student }) {
//   const [imgError, setImgError] = useState(false);
//   const name = student?.name || "Student";
//   const photo = getPhotoSrc(student?.photo);

//   return (
//     <div className="tutor-home-feedback-avatar">
//       {photo && !imgError ? (
//         <img src={photo} alt={name} onError={() => setImgError(true)} />
//       ) : (
//         <span>{name.charAt(0).toUpperCase()}</span>
//       )}
//     </div>
//   );
// }

// function TutorFeedbackPreview() {
//   const { showAlert } = useAlert();

//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [pageIndex, setPageIndex] = useState(0);

//   async function fetchFeedbacks() {
//     try {
//       setLoading(true);

//       const { data } = await api.get("/get/feedback/all");
//       setFeedbacks(data?.feedbacks || []);
//     } catch (err) {
//       showAlert(
//         err?.response?.data?.msg ||
//           err?.response?.data?.error ||
//           "Failed to fetch student reviews",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchFeedbacks();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const feedbackGroups = useMemo(() => {
//     const groups = [];

//     for (let i = 0; i < feedbacks.length; i += 3) {
//       groups.push(feedbacks.slice(i, i + 3));
//     }

//     return groups;
//   }, [feedbacks]);

//   useEffect(() => {
//     if (feedbackGroups.length <= 1) return;

//     const timer = setInterval(() => {
//       setPageIndex((prev) => (prev + 1) % feedbackGroups.length);
//     }, 15000);

//     return () => clearInterval(timer);
//   }, [feedbackGroups.length]);

//   const visibleFeedbacks = feedbackGroups[pageIndex] || [];

//   return (
//     <section className="tutor-home-feedback-section">
//       <div className="tutor-home-feedback-header">
//         <h2>What Students Say</h2>
//       </div>

//       {loading ? (
//         <div className="tutor-home-feedback-state">
//           Loading student feedbacks...
//         </div>
//       ) : feedbacks.length === 0 ? (
//         <div className="tutor-home-feedback-state">
//           No student feedbacks found.
//         </div>
//       ) : (
//         <>
//           <div className="tutor-home-feedback-slider">
//             <div key={pageIndex} className="tutor-home-feedback-row">
//               {visibleFeedbacks.map((feedback) => {
//                 const student = getStudent(feedback);
//                 const message = feedback?.message || "No review added.";

//                 return (
//                   <div className="tutor-home-feedback-card" key={feedback?._id}>
//                     <div className="tutor-home-feedback-card-top">
//                       <div className="tutor-home-feedback-user">
//                         <TutorStudentAvatar student={student} />

//                         <div>
//                           <h3>{student?.name || "Student"}</h3>
//                         </div>
//                       </div>

//                       <Stars rating={feedback?.rating} />
//                     </div>

//                     <p className="tutor-home-feedback-message">
//                       {message.length > 130
//                         ? `${message.slice(0, 130)}...`
//                         : message}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {feedbackGroups.length > 1 && (
//             <div className="tutor-home-feedback-dots">
//               {feedbackGroups.map((_, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   className={
//                     pageIndex === index
//                       ? "tutor-home-feedback-dot active"
//                       : "tutor-home-feedback-dot"
//                   }
//                   onClick={() => setPageIndex(index)}
//                   aria-label={`Show feedback group ${index + 1}`}
//                 />
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </section>
//   );
// }

// export default function TutorHomePage() {
//   return (
//     <div className="tutor-home-page">
//       <div className="tutor-home-stack">
//         <TutorBannerSection />
//         <TutorCategorySection />
//         <TutorFeedbackPreview />
//       </div>
//     </div>
//   );
// }

































import React, { useEffect, useMemo, useState } from "react";
import TutorBannerSection from "../Components/TutorBannerSection";
import TutorCategorySection from "../Components/TutorCategorySection";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import "./TutorHomePage.css";


import { getMediaUrl } from "../utils/media";





function getStudent(feedback) {
  return feedback?.studentId || {};
}

// function getPhotoSrc(photo) {
//   if (!photo) return "";

//   const src = String(photo).trim();

//   if (
//     src.startsWith("data:image") ||
//     src.startsWith("blob:") ||
//     src.startsWith("http://") ||
//     src.startsWith("https://")
//   ) {
//     return src;
//   }

//   return src;
// }







function getPhotoSrc(photo) {
  if (!photo) return "";

  const src = String(photo || "").trim();

  if (
    !src ||
    src === "null" ||
    src === "undefined" ||
    src === "false" ||
    src === "NaN"
  ) {
    return "";
  }

  return getMediaUrl(src);
}








function Stars({ rating }) {
  const value = Math.round(Number(rating) || 0);

  return (
    <div className="tutor-home-feedback-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= value ? "filled" : ""}>
          ★
        </span>
      ))}
    </div>
  );
}

function TutorStudentAvatar({ student }) {
  const [imgError, setImgError] = useState(false);
  const name = student?.name || "Student";
  const photo = getPhotoSrc(student?.photo);

  return (
    <div className="tutor-home-feedback-avatar">
      {photo && !imgError ? (
        <img src={photo} alt={name} onError={() => setImgError(true)} />
      ) : (
        <span>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

function TutorFeedbackPreview() {
  const { showAlert } = useAlert();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    let alive = true;

    async function fetchFeedbacks() {
      try {
        setLoading(true);

        const { data } = await api.get("/get/feedback/all");

        if (!alive) return;

        const cleanFeedbacks = (data?.feedbacks || []).filter(
          (item) => item?.studentId?._id && item?.studentId?.name
        );

        setFeedbacks(cleanFeedbacks);
        setPageIndex(0);
      } catch (err) {
        if (!alive) return;

        showAlert(
          err?.response?.data?.msg ||
            err?.response?.data?.error ||
            "Failed to fetch student reviews",
          "error"
        );
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    fetchFeedbacks();

    return () => {
      alive = false;
    };
  }, []);

  const feedbackGroups = useMemo(() => {
    const groups = [];

    for (let i = 0; i < feedbacks.length; i += 3) {
      groups.push(feedbacks.slice(i, i + 3));
    }

    return groups;
  }, [feedbacks]);

  useEffect(() => {
    if (feedbackGroups.length <= 1) return undefined;

    const timer = setInterval(() => {
      setPageIndex((prev) => {
        const nextLength = feedbackGroups.length || 1;
        return (prev + 1) % nextLength;
      });
    }, 15000);

    return () => clearInterval(timer);
  }, [feedbackGroups.length]);

  const visibleFeedbacks = feedbackGroups[pageIndex] || [];

  return (
    <section className="tutor-home-feedback-section">
      <div className="tutor-home-feedback-header">
        <h2>What Students Say</h2>
      </div>

      {loading ? (
        <div className="tutor-home-feedback-state">
          Loading student feedbacks...
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="tutor-home-feedback-state">
          No student feedbacks found.
        </div>
      ) : (
        <>
          <div className="tutor-home-feedback-slider">
            <div key={pageIndex} className="tutor-home-feedback-row">
              {visibleFeedbacks.map((feedback) => {
                const student = getStudent(feedback);
                const message = feedback?.message || "No review added.";

                return (
                  <div className="tutor-home-feedback-card" key={feedback._id}>
                    <div className="tutor-home-feedback-card-top">
                      <div className="tutor-home-feedback-user">
                        <TutorStudentAvatar student={student} />

                        <div>
                          <h3>{student?.name || "Student"}</h3>
                        </div>
                      </div>

                      <Stars rating={feedback?.rating} />
                    </div>

                    <p className="tutor-home-feedback-message">
                      {message.length > 130
                        ? `${message.slice(0, 130)}...`
                        : message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {feedbackGroups.length > 1 && (
            <div className="tutor-home-feedback-dots">
              {feedbackGroups.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    pageIndex === index
                      ? "tutor-home-feedback-dot active"
                      : "tutor-home-feedback-dot"
                  }
                  onClick={() => setPageIndex(index)}
                  aria-label={`Show feedback group ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function TutorHomePage() {
  return (
    <div className="tutor-home-page">
      <div className="tutor-home-stack">
        <TutorBannerSection />
        <TutorCategorySection />
        <TutorFeedbackPreview />
      </div>
    </div>
  );
}