

// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import "./StudentTutorsPage.css";

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
//     <div className="student-tutor-stars">
//       {[1, 2, 3, 4, 5].map((n) => (
//         <span
//           key={n}
//           className={n <= rounded ? "student-star filled" : "student-star"}
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

// export default function StudentTutorsPage() {
//   const navigate = useNavigate();
//   const { showAlert } = useAlert();

//   const [tutors, setTutors] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const filteredTutors = useMemo(() => {
//     const q = search.toLowerCase().trim();
//     if (!q) return tutors;

//     return tutors.filter((tutor) => {
//       return (
//         String(tutor.name || "").toLowerCase().includes(q) ||
//         String(getSubjects(tutor)).toLowerCase().includes(q) ||
//         String(tutor.qualification || "").toLowerCase().includes(q)
//       );
//     });
//   }, [tutors, search]);

//   async function fetchTutors() {
//     try {
//       setLoading(true);
//       const { data } = await api.get("/tuter/all");
//       setTutors(data.tuters || []);
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchTutors();
//   }, []);

//   return (
//     <div className="student-tutors-page">
//       <div className="student-tutor-toolbar">
//         <div className="student-tutor-search">
//           <span>⌕</span>
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search tutors..."
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="student-tutor-state">Loading tutors...</div>
//       ) : filteredTutors.length === 0 ? (
//         <div className="student-tutor-state">No tutors found</div>
//       ) : (
//         <div className="student-tutor-grid">
//           {filteredTutors.map((tutor) => (
//             <article className="student-tutor-card" key={tutor._id}>
//               <div className="student-tutor-card-top">
//                 <div className="student-tutor-avatar">
//                   {tutor.photo ? (
//                     <img src={getMediaUrl(tutor.photo)} alt={tutor.name} />
//                   ) : (
//                     <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
//                   )}
//                 </div>

//                 <div className="student-tutor-info">
//                   <h3>{tutor.name || "Tutor"}</h3>
//                   <p>{tutor.qualification || "Qualification not added"}</p>
//                 </div>
//               </div>

//               <p className="student-tutor-about">
//                 {tutor.about || "No description added"}
//               </p>

//               <Stars rating={tutor.averageRating} />
















//               <button
//                 type="button"
//                 className="student-view-details-btn"
//                 onClick={() => {
//                   const backData = {
//                     backTo: "/student/tutors",
//                     backButtonLabel: "Tutors",
//                     backLabel: "View details",
//                   };

//                   sessionStorage.setItem("studentTutorBackData", JSON.stringify(backData));

//                   navigate(`/student/tutors/${tutor._id}`, {
//                     state: backData,
//                   });
//                 }}
//               >
//                 View Details
//               </button>











//             </article>
//           ))}
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
import "./StudentTutorsPage.css";

function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
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

function getCourseNames(tutor) {
  if (Array.isArray(tutor?.courseIds) && tutor.courseIds.length > 0) {
    const names = tutor.courseIds
      .map((course) => course?.name || course?.title || "")
      .filter(Boolean);

    if (names.length > 0) return names.join(", ");
  }

  return tutor?.courseId?.name || tutor?.courseName || "";
}

function isTutorActive(tutor) {
  return tutor?.isActive === true || tutor?.isActive === "true" || tutor?.isActive === 1;
}

function isTutorBlocked(tutor) {
  return tutor?.isBlocked === true || tutor?.isBlocked === "true" || tutor?.isBlocked === 1;
}

function Stars({ rating = 0 }) {
  const fixedRating = Number(rating || 0);
  const rounded = Math.round(fixedRating);

  return (
    <div className="student-tutor-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rounded ? "student-star filled" : "student-star"}>
          ★
        </span>
      ))}
      <b>{fixedRating.toFixed(1)}</b>
    </div>
  );
}

function TutorCard({ tutor, assigned = false, onDetails, onChat }) {
  const photoSrc = getImageSrc(tutor?.photo);

  return (
    <article className="student-tutor-card">
      <div className="student-tutor-card-top">
        <div className="student-tutor-avatar">
          {photoSrc ? (
            <img src={photoSrc} alt={tutor?.name || "Tutor"} />
          ) : (
            <span>{tutor?.name?.charAt(0)?.toUpperCase() || "T"}</span>
          )}
        </div>

        {/* <div>
          <h3>{tutor?.name || "Tutor"}</h3>
          <p>{tutor?.qualification || getCourseNames(tutor) || "Qualification not added"}</p>
        </div> */}



<div className="student-tutor-info">
  <h3>{tutor?.name || "Tutor"}</h3>
  <p title={tutor?.qualification || getCourseNames(tutor) || "Qualification not added"}>
    {tutor?.qualification || getCourseNames(tutor) || "Qualification not added"}
  </p>
</div>




      </div>

      <p className="student-tutor-about">
        {tutor?.about || "No description added"}
      </p>

      <Stars rating={tutor?.averageRating} />

      {assigned ? (
        <div className="student-tutor-card-actions">
          <button type="button" className="student-tutor-chat-btn" onClick={() => onChat(tutor)}>
            Chat
          </button>

          <button type="button" className="student-view-details-btn" onClick={() => onDetails(tutor)}>
            View Details
          </button>
        </div>
      ) : (
        <button type="button" className="student-view-details-btn" onClick={() => onDetails(tutor)}>
          View Details
        </button>
      )}
    </article>
  );
}

export default function StudentTutorsPage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [tutors, setTutors] = useState([]);
  const [assignedTutors, setAssignedTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchTutors() {
    try {
      setLoading(true);

      const [allRes, assignedRes] = await Promise.all([
        api.get("/tuter/all"),
        api.get("/student/my-assigned-tutors"),
      ]);

      const allTutors =
        allRes.data?.tuters ||
        allRes.data?.tutors ||
        allRes.data?.data ||
        [];

      const myTutors = assignedRes.data?.tutors || [];

      setTutors(allTutors);
      setAssignedTutors(myTutors);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load tutors"), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTutors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const assignedTutorIds = useMemo(() => {
    return new Set(assignedTutors.map((tutor) => String(tutor._id)));
  }, [assignedTutors]);

  // const filteredAssignedTutors = useMemo(() => {
  //   const q = search.trim().toLowerCase();

  //   return assignedTutors.filter((tutor) => {
  //     if ( isTutorBlocked(tutor)) return false;

  //     if (!q) return true;

  //     return [
  //       tutor.name,
  //       tutor.email,
  //       tutor.phone,
  //       tutor.qualification,
  //       tutor.about,
  //       getCourseNames(tutor),
  //     ]
  //       .join(" ")
  //       .toLowerCase()
  //       .includes(q);
  //   });
  // }, [assignedTutors, search]);






const filteredAssignedTutors = useMemo(() => {
  const q = search.trim().toLowerCase();

  return assignedTutors.filter((tutor) => {
    if (isTutorBlocked(tutor)) return false;

    if (!q) return true;

    return [
      tutor.name,
      tutor.email,
      tutor.phone,
      tutor.qualification,
      tutor.about,
      getCourseNames(tutor),
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
}, [assignedTutors, search]);






  const filteredOtherTutors = useMemo(() => {
    const q = search.trim().toLowerCase();

    return tutors.filter((tutor) => {
      // if (assignedTutorIds.has(String(tutor._id))) return false;
      // if ( isTutorBlocked(tutor)) return false;

      if (assignedTutorIds.has(String(tutor._id))) return false;
if (!isTutorActive(tutor)) return false;
if (isTutorBlocked(tutor)) return false;

      if (!q) return true;

      return [
        tutor.name,
        tutor.email,
        tutor.phone,
        tutor.qualification,
        tutor.about,
        getCourseNames(tutor),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [tutors, assignedTutorIds, search]);

  // function goToDetails(tutor) {
  //   navigate(`/student/tutors/${tutor._id}`);
  // }






function goToDetails(tutor) {
  if (!tutor?._id) {
    showAlert("Tutor id not found", "error");
    return;
  }

  const backData = {
    backTo: "/student/tutors",
    backButtonLabel: "Tutors",
    backLabel: "View details",
  };

  sessionStorage.setItem("studentTutorBackData", JSON.stringify(backData));

  navigate(`/student/tutors/${tutor._id}`, {
    state: backData,
  });
}





  async function openTutorChat(tutor) {
    try {
      const { data } = await api.post(`/chat/student-tutor-room/${tutor._id}`);

      const roomId = data?.room?._id || data?.chatRoom?._id || data?.roomId;

      if (roomId) {
        navigate(`/student/chats?roomId=${roomId}&open=chat`);
      } else {
        navigate("/student/chats");
      }
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to open tutor chat"), "error");
    }
  }

  return (
    <div className="student-tutors-page">
      <div className="student-tutors-toolbar">
        <div className="student-tutors-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutors..."
          />
        </div>
      </div>

      {loading ? (
        <div className="student-tutors-state">Loading tutors...</div>
      ) : (
        <>
          {filteredAssignedTutors.length > 0 && (
            <>
              <h2 className="student-tutors-section-title">My Tutors</h2>

              <div className="student-tutors-grid">
                {filteredAssignedTutors.map((tutor) => (
                  <TutorCard
                    key={tutor._id}
                    tutor={tutor}
                    assigned
                    onDetails={goToDetails}
                    onChat={openTutorChat}
                  />
                ))}
              </div>

              <div className="student-tutors-section-line" />
            </>
          )}

          {filteredOtherTutors.length === 0 ? (
            <div className="student-tutors-state">No tutors found</div>
          ) : (
            <div className="student-tutors-grid">
              {filteredOtherTutors.map((tutor) => (
                <TutorCard
                  key={tutor._id}
                  tutor={tutor}
                  assigned={false}
                  onDetails={goToDetails}
                  onChat={openTutorChat}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}