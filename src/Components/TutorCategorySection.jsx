// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import "./TutorCategorySection.css";

// function getErrorMessage(error, fallback = "Failed to fetch categories") {
//   return (
//     error?.response?.data?.msg ||
//     error?.response?.data?.error ||
//     error?.message ||
//     fallback
//   );
// }

// function getFallbackIcon(title = "") {
//   const value = String(title).toLowerCase();

//   if (value.includes("online")) return "💻";
//   if (value.includes("talent") || value.includes("tallent")) return "🎭";
//   if (value.includes("skill")) return "🛠️";

//   return "📚";
// }

// export default function TutorCategorySection() {
//   const { showAlert } = useAlert();

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   async function fetchCategories() {
//     try {
//       setLoading(true);

//       const { data } = await api.get("/category/all");
//       setCategories(data.categories || []);
//     } catch (error) {
//       showAlert(getErrorMessage(error), "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchCategories();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <section className="tutor-category-section">
//       <div className="tutor-category-head">
//         <h2>Our Courses</h2>
//       </div>

//       {loading ? (
//         <div className="tutor-state-card">Loading courses...</div>
//       ) : categories.length === 0 ? (
//         <div className="tutor-state-card">No courses found.</div>
//       ) : (
//         <div className="tutor-category-grid">
//           {categories.map((category) => (
//             <article className="tutor-category-card" key={category._id}>
//               <div className="tutor-category-media">
//                 {category.image ? (
//                   <img src={getMediaUrl(category.image)} alt={category.title} />
//                 ) : (
//                   <div className="tutor-category-fallback">
//                     {getFallbackIcon(category.title)}
//                   </div>
//                 )}
//               </div>

//               <div className="tutor-category-body">
//                 <h3>{category.title}</h3>

//                 <p>
//                   {category.description ||
//                     "Explore flexible learning courses with expert guidance."}
//                 </p>

//                 <button
//                   type="button"
//                   className="tutor-category-btn"
//                   onClick={() =>
//                     showAlert("Tutor course page will be added soon", "info")
//                   }
//                 >
//                   View Courses
//                 </button>
//               </div>
//             </article>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }





















































// import React, { useEffect, useState } from "react";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import "./TutorCategorySection.css";

// function getErrorMessage(error, fallback = "Failed to fetch categories") {
//   return (
//     error?.response?.data?.msg ||
//     error?.response?.data?.error ||
//     error?.message ||
//     fallback
//   );
// }

// function getFallbackIcon(title = "") {
//   const value = String(title).toLowerCase();

//   if (value.includes("online")) return "💻";
//   if (value.includes("talent") || value.includes("tallent")) return "🎭";
//   if (value.includes("skill")) return "🛠️";

//   return "📚";
// }

// export default function TutorCategorySection() {
//   const { showAlert } = useAlert();

//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let alive = true;

//     async function fetchCategories() {
//       try {
//         setLoading(true);

//         const { data } = await api.get("/category/all");

//         if (!alive) return;

//         setCategories(data?.categories || []);
//       } catch (error) {
//         if (!alive) return;
//         showAlert(getErrorMessage(error), "error");
//       } finally {
//         if (alive) {
//           setLoading(false);
//         }
//       }
//     }

//     fetchCategories();

//     return () => {
//       alive = false;
//     };
//   }, []);

//   return (
//     <section className="tutor-category-section">
//       <div className="tutor-category-head">
//         <h2>Our Courses</h2>
//       </div>

//       {loading ? (
//         <div className="tutor-state-card">Loading courses...</div>
//       ) : categories.length === 0 ? (
//         <div className="tutor-state-card">No courses found.</div>
//       ) : (
//         <div className="tutor-category-grid">
//           {categories.map((category) => (
//             <article className="tutor-category-card" key={category._id}>
//               <div className="tutor-category-media">
//                 {category.image ? (
//                   <img src={getMediaUrl(category.image)} alt={category.title} />
//                 ) : (
//                   <div className="tutor-category-fallback">
//                     {getFallbackIcon(category.title)}
//                   </div>
//                 )}
//               </div>

//               <div className="tutor-category-body">
//                 <h3>{category.title}</h3>

//                 <p>
//                   {category.description ||
//                     "Explore flexible learning courses with expert guidance."}
//                 </p>

//                 <button
//                   type="button"
//                   className="tutor-category-btn"
//                   onClick={() => {}}
//                 >
//                   View Courses
//                 </button>
//               </div>
//             </article>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }






































import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import "./TutorCategorySection.css";

function getErrorMessage(error, fallback = "Failed to fetch categories") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function getFallbackIcon(title = "") {
  const value = String(title).toLowerCase();

  if (value.includes("online")) return "💻";
  if (value.includes("talent") || value.includes("tallent")) return "🎭";
  if (value.includes("skill")) return "🛠️";

  return "📚";
}

export default function TutorCategorySection() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function fetchCategories() {
      try {
        setLoading(true);

        const { data } = await api.get("/category/all");

        if (!alive) return;

        setCategories(data?.categories || []);
      } catch (error) {
        if (!alive) return;
        showAlert(getErrorMessage(error), "error");
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="tutor-category-section">
      <div className="tutor-category-head">
        <h2>Our Courses</h2>
      </div>

      {loading ? (
        <div className="tutor-state-card">Loading courses...</div>
      ) : categories.length === 0 ? (
        <div className="tutor-state-card">No courses found.</div>
      ) : (
        <div className="tutor-category-grid">
          {categories.map((category) => (
            <article className="tutor-category-card" key={category._id}>
              <div className="tutor-category-media">
                {category.image ? (
                  <img src={getMediaUrl(category.image)} alt={category.title} />
                ) : (
                  <div className="tutor-category-fallback">
                    {getFallbackIcon(category.title)}
                  </div>
                )}
              </div>

              <div className="tutor-category-body">
                <h3>{category.title}</h3>

                <p>
                  {category.description ||
                    "Explore flexible learning courses with expert guidance."}
                </p>

                <button
                  type="button"
                  className="tutor-category-btn"
                  onClick={() => navigate(`/tutor/courses/${category._id}`)}
                >
                  View Courses
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}