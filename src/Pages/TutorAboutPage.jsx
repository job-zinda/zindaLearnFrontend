// import React, { useEffect, useMemo, useState } from "react";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import "./TutorAboutPage.css";

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

// function getErrorMessage(error, fallback = "Something went wrong") {
//   return (
//     error?.response?.data?.msg ||
//     error?.response?.data?.error ||
//     error?.message ||
//     fallback
//   );
// }

// function normalizeId(value) {
//   if (!value) return "";
//   return typeof value === "object" ? String(value._id || "") : String(value);
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

// function getCourseCategory(course, categories) {
//   const categoryId = normalizeId(course?.categoryId);
//   return categories.find((cat) => String(cat._id) === String(categoryId));
// }

// function getCourseLabel(course, categories) {
//   const category = getCourseCategory(course, categories);
//   const isOnline = category?.key === "online_tuition";

//   if (!isOnline) {
//     return course?.name || "Course";
//   }

//   if (course?.sectionType === "one_to_one") {
//     return `${course.name} - One-to-One`;
//   }

//   if (course?.sectionType === "batch") {
//     return `${course.name} - Batch`;
//   }

//   return course?.name || "Course";
// }

// function getCategoryTitles(tutor) {
//   if (Array.isArray(tutor?.categoryIds) && tutor.categoryIds.length > 0) {
//     return tutor.categoryIds
//       .map((cat) => (typeof cat === "object" ? cat.title : ""))
//       .filter(Boolean)
//       .join(", ");
//   }

//   if (typeof tutor?.categoryId === "object") {
//     return tutor.categoryId.title || "";
//   }

//   return "";
// }

// function getCourseTitles(tutor) {
//   if (Array.isArray(tutor?.courseIds) && tutor.courseIds.length > 0) {
//     return tutor.courseIds
//       .map((course) => (typeof course === "object" ? course.name : ""))
//       .filter(Boolean)
//       .join(", ");
//   }

//   if (typeof tutor?.courseId === "object") {
//     return tutor.courseId.name || "";
//   }

//   return "";
// }

// export default function TutorAboutPage() {
//   const { showAlert } = useAlert();

//   const [tutor, setTutor] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [courses, setCourses] = useState([]);

//   const [form, setForm] = useState(emptyForm);
//   const [preview, setPreview] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
// //////////////////////////////////////////////////////////////////////////////////
//   const selectedCategories = useMemo(() => {
//     return categories.filter((cat) =>
//       Array.isArray(form.categoryIds)
//         ? form.categoryIds.map(String).includes(String(cat._id))
//         : false
//     );
//   }, [categories, form.categoryIds]);
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   const isOnlineTuition = useMemo(() => {
//     return selectedCategories.some((cat) => cat.key === "online_tuition");
//   }, [selectedCategories]);

//   const visibleCourses = useMemo(() => {
//     if (!Array.isArray(form.categoryIds) || form.categoryIds.length === 0) {
//       return [];
//     }

//     const selectedIds = form.categoryIds.map(String);

//     return courses.filter((course) =>
//       selectedIds.includes(String(normalizeId(course.categoryId)))
//     );
//   }, [courses, form.categoryIds]);

//   function fillFormFromTutor(tutorData) {
//     const existingCategoryIds =
//       Array.isArray(tutorData?.categoryIds) && tutorData.categoryIds.length
//         ? tutorData.categoryIds.map((cat) => normalizeId(cat)).filter(Boolean)
//         : tutorData?.categoryId
//         ? [normalizeId(tutorData.categoryId)]
//         : [];

//     const existingCourseIds =
//       Array.isArray(tutorData?.courseIds) && tutorData.courseIds.length
//         ? tutorData.courseIds.map((course) => normalizeId(course)).filter(Boolean)
//         : tutorData?.courseId
//         ? [normalizeId(tutorData.courseId)]
//         : [];

//     const onlineSelected = existingCategoryIds.some((catId) => {
//       const cat = categories.find((item) => String(item._id) === String(catId));
//       return cat?.key === "online_tuition";
//     });

//     setForm({
//       name: tutorData?.name || "",
//       email: tutorData?.email || "",
//       phone: tutorData?.phone || "",
//       qualification: tutorData?.qualification || "",
//       about: tutorData?.about || "",
//       subjects: Array.isArray(tutorData?.subjects)
//         ? tutorData.subjects.join(", ")
//         : tutorData?.subjects || "",
//       categoryIds: existingCategoryIds,
//       syllabus: onlineSelected ? tutorData?.syllabus || "" : "none",
//       courseIds: existingCourseIds,
//       photo: null,
//     });

//     setPreview(tutorData?.photo ? getImageSrc(tutorData.photo) : "");
//   }

//   async function fetchData() {
//     try {
//       setLoading(true);

//       const [profileRes, optionRes] = await Promise.all([
//         api.get("/tutor/about/me"),
//         api.get("/tutor/about/options"),
//       ]);

//       const tutorData = profileRes.data?.tuter || null;
//       const categoryList = optionRes.data?.categories || [];
//       const courseList = optionRes.data?.courses || [];

//       setTutor(tutorData);
//       setCategories(categoryList);
//       setCourses(courseList);

//       const existingCategoryIds =
//         Array.isArray(tutorData?.categoryIds) && tutorData.categoryIds.length
//           ? tutorData.categoryIds.map((cat) => normalizeId(cat)).filter(Boolean)
//           : tutorData?.categoryId
//           ? [normalizeId(tutorData.categoryId)]
//           : [];

//       const existingCourseIds =
//         Array.isArray(tutorData?.courseIds) && tutorData.courseIds.length
//           ? tutorData.courseIds
//               .map((course) => normalizeId(course))
//               .filter(Boolean)
//           : tutorData?.courseId
//           ? [normalizeId(tutorData.courseId)]
//           : [];

//       const onlineSelected = existingCategoryIds.some((catId) => {
//         const cat = categoryList.find(
//           (item) => String(item._id) === String(catId)
//         );
//         return cat?.key === "online_tuition";
//       });

//       setForm({
//         name: tutorData?.name || "",
//         email: tutorData?.email || "",
//         phone: tutorData?.phone || "",
//         qualification: tutorData?.qualification || "",
//         about: tutorData?.about || "",
//         subjects: Array.isArray(tutorData?.subjects)
//           ? tutorData.subjects.join(", ")
//           : tutorData?.subjects || "",
//         categoryIds: existingCategoryIds,
//         syllabus: onlineSelected ? tutorData?.syllabus || "" : "none",
//         courseIds: existingCourseIds,
//         photo: null,
//       });

//       setPreview(tutorData?.photo ? getImageSrc(tutorData.photo) : "");
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to load tutor about"), "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

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

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }

//   function toggleCategorySelection(categoryId, checked) {
//     setForm((prev) => {
//       const currentCategoryIds = Array.isArray(prev.categoryIds)
//         ? prev.categoryIds.map(String)
//         : [];

//       const currentCourseIds = Array.isArray(prev.courseIds)
//         ? prev.courseIds.map(String)
//         : [];

//       const selectedCategoryId = String(categoryId);

//       const nextCategoryIds = checked
//         ? Array.from(new Set([...currentCategoryIds, selectedCategoryId]))
//         : currentCategoryIds.filter((id) => id !== selectedCategoryId);

//       const allowedCourseIds = courses
//         .filter((course) =>
//           nextCategoryIds.includes(String(normalizeId(course.categoryId)))
//         )
//         .map((course) => String(course._id));

//       const nextCourseIds = currentCourseIds.filter((courseId) =>
//         allowedCourseIds.includes(String(courseId))
//       );

//       const hasOnlineTuition = nextCategoryIds.some((catId) => {
//         const cat = categories.find((item) => String(item._id) === String(catId));
//         return cat?.key === "online_tuition";
//       });

//       return {
//         ...prev,
//         categoryIds: nextCategoryIds,
//         courseIds: nextCourseIds,
//         syllabus: hasOnlineTuition
//           ? prev.syllabus === "none"
//             ? ""
//             : prev.syllabus || ""
//           : "none",
//       };
//     });
//   }

//   function toggleCourseSelection(courseId, checked) {
//     setForm((prev) => {
//       const currentCourseIds = Array.isArray(prev.courseIds)
//         ? prev.courseIds.map(String)
//         : [];

//       const selectedCourseId = String(courseId);

//       return {
//         ...prev,
//         courseIds: checked
//           ? Array.from(new Set([...currentCourseIds, selectedCourseId]))
//           : currentCourseIds.filter((id) => id !== selectedCourseId),
//       };
//     });
//   }

//   async function saveTutorAbout(e) {
//     e.preventDefault();

//     try {
//       if (!form.name.trim()) {
//         return showAlert("Tutor name required", "error");
//       }

//       if (!form.email.trim()) {
//         return showAlert("Tutor email required", "error");
//       }

//       if (!form.phone.trim()) {
//         return showAlert("Tutor phone required", "error");
//       }

//       if (!Array.isArray(form.categoryIds) || form.categoryIds.length === 0) {
//         return showAlert("At least one category select cheyyuka", "error");
//       }

//       if (!Array.isArray(form.courseIds) || form.courseIds.length === 0) {
//         return showAlert("At least one course select cheyyuka", "error");
//       }

//       if (isOnlineTuition && !String(form.syllabus || "").trim()) {
//         return showAlert("Syllabus enter cheyyuka", "error");
//       }

//       const fd = new FormData();

//       fd.append("name", form.name.trim());
//       fd.append("email", form.email.trim());
//       fd.append("phone", form.phone.trim());
//       fd.append("qualification", form.qualification.trim());
//       fd.append("about", form.about.trim());
//       fd.append("subjects", form.subjects.trim());

//       form.categoryIds.forEach((categoryId) => {
//         fd.append("categoryIds", categoryId);
//       });

//       fd.append("categoryId", form.categoryIds[0]);

//       fd.append("syllabus", isOnlineTuition ? form.syllabus.trim() : "none");

//       form.courseIds.forEach((courseId) => {
//         fd.append("courseIds", courseId);
//       });

//       fd.append("courseId", form.courseIds[0]);

//       if (form.photo) {
//         fd.append("photo", form.photo);
//       }

//       setSaving(true);

//       const { data } = await api.put("/tutor/about/me", fd);

//       const updatedTutor = data?.tuter || null;

//       if (updatedTutor) {
//         setTutor(updatedTutor);
//         fillFormFromTutor(updatedTutor);
//       }

//       if (data?.user) {
//         const oldUser = JSON.parse(localStorage.getItem("user") || "{}");

//         localStorage.setItem(
//           "user",
//           JSON.stringify({
//             ...oldUser,
//             ...data.user,
//           })
//         );

//         window.dispatchEvent(new Event("storage"));
//       }

//       showAlert("Tutor about updated successfully", "success");
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to update tutor about"), "error");
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) {
//     return <div className="tutor-about-page-state">Loading tutor about...</div>;
//   }

//   if (!tutor) {
//     return <div className="tutor-about-page-state">Tutor profile not found.</div>;
//   }

//   return (
//     <div className="tutor-about-page">
//       <div className="tutor-about-hero-card">
//         <div className="tutor-about-hero-left">
//           <div className="tutor-about-avatar">
//             {preview ? (
//               <img src={preview} alt={form.name || "Tutor"} />
//             ) : (
//               <span>{form.name?.charAt(0)?.toUpperCase() || "T"}</span>
//             )}
//           </div>

//           <div>
//             {/* <span className="tutor-about-pill">Tutor Profile</span> */}
//             <h2>{form.name || "Tutor"}</h2>
//             <p>{form.qualification || "Qualification not added"}</p>
//           </div>
//         </div>

//         <div className="tutor-about-hero-info">
//           <p>
//             <b>Email:</b> {form.email || "No email added"}
//           </p>
//           <p>
//             <b>Phone:</b> {form.phone || "No phone added"}
//           </p>
//           <p>
//             <b>Categories:</b> {getCategoryTitles(tutor) || "Not selected"}
//           </p>
//           <p>
//             <b>Courses:</b> {getCourseTitles(tutor) || "Not selected"}
//           </p>
//         </div>
//       </div>

//       <form className="tutor-about-form" onSubmit={saveTutorAbout}>
//         <div className="tutor-about-section-title">
//           <h3>About Details</h3>
//           <p>Update your tutor profile details shown to students.</p>
//         </div>

//         <div className="tutor-about-form-grid">
//           <label className="tutor-about-field">
//             <span>Tutor Photo</span>
//             <input
//               type="file"
//               name="photo"
//               accept="image/*"
//               onChange={handleChange}
//             />
//           </label>

//           <label className="tutor-about-field">
//             <span>Name</span>
//             <input name="name" value={form.name} onChange={handleChange} />
//           </label>

//           <label className="tutor-about-field">
//             <span>Email</span>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//             />
//           </label>

//           <label className="tutor-about-field">
//             <span>Phone</span>
//             <input name="phone" value={form.phone} onChange={handleChange} />
//           </label>

//           <label className="tutor-about-field">
//             <span>Qualification</span>
//             <input
//               name="qualification"
//               value={form.qualification}
//               onChange={handleChange}
//               placeholder="Example: BA English"
//             />
//           </label>

//           <label className="tutor-about-field tutor-about-field--full">
//             <span>About / Description</span>
//             <textarea
//               name="about"
//               rows="5"
//               value={form.about}
//               onChange={handleChange}
//               placeholder="Write about your teaching experience..."
//             />
//           </label>

//           <label className="tutor-about-field tutor-about-field--full">
//             <span>Subjects</span>
//             <input
//               name="subjects"
//               value={form.subjects}
//               onChange={handleChange}
//               placeholder="Example: English, Mathematics, Physics"
//             />
//           </label>

//           <div className="tutor-about-field tutor-about-field--full">
//             <span>Categories</span>

//             <div className="tutor-about-check-list">
//               {categories.length === 0 ? (
//                 <p className="tutor-about-empty">No categories found</p>
//               ) : (
//                 categories.map((cat) => {
//                   const checked = Array.isArray(form.categoryIds)
//                     ? form.categoryIds.map(String).includes(String(cat._id))
//                     : false;

//                   return (
//                     <label key={cat._id} className="tutor-about-check-item">
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={(e) =>
//                           toggleCategorySelection(cat._id, e.target.checked)
//                         }
//                       />

//                       <span>{cat.title}</span>
//                     </label>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {isOnlineTuition && (
//             <label className="tutor-about-field tutor-about-field--full">
//               <span>Syllabus</span>
//               <input
//                 name="syllabus"
//                 value={form.syllabus}
//                 onChange={handleChange}
//                 placeholder="Example: State, CBSE, ICSE"
//               />
//             </label>
//           )}

//           <div className="tutor-about-field tutor-about-field--full">
//             <span>Courses / Classes</span>

//             <div className="tutor-about-check-list tutor-about-course-list">
//               {visibleCourses.length === 0 ? (
//                 <p className="tutor-about-empty">
//                   Select category to show courses
//                 </p>
//               ) : (
//                 visibleCourses.map((course) => {
//                   const checked = Array.isArray(form.courseIds)
//                     ? form.courseIds.map(String).includes(String(course._id))
//                     : false;

//                   const category = getCourseCategory(course, categories);

//                   return (
//                     <label key={course._id} className="tutor-about-check-item">
//                       <input
//                         type="checkbox"
//                         checked={checked}
//                         onChange={(e) =>
//                           toggleCourseSelection(course._id, e.target.checked)
//                         }
//                       />

//                       <span>
//                         {getCourseLabel(course, categories)}
//                         {category?.title ? (
//                           <small>{category.title}</small>
//                         ) : null}
//                       </span>
//                     </label>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="tutor-about-actions">
//           <button type="button" className="tutor-about-reset-btn" onClick={fetchData}>
//             Reset
//           </button>

//           <button type="submit" className="tutor-about-save-btn" disabled={saving}>
//             {saving ? "Saving..." : "Save Details"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }





















































import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import "./TutorAboutPage.css";

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

function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

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
    return course?.name || "Course";
  }

  if (course?.sectionType === "one_to_one") {
    return `${course.name} - One-to-One`;
  }

  if (course?.sectionType === "batch") {
    return `${course.name} - Batch`;
  }

  return course?.name || "Course";
}

// function getCategoryTitlesFromIds(categoryIds, categories) {
//   if (!Array.isArray(categoryIds) || categoryIds.length === 0) return "";

//   const selectedIds = categoryIds.map(String);

//   return categories
//     .filter((cat) => selectedIds.includes(String(cat._id)))
//     .map((cat) => cat.title)
//     .filter(Boolean)
//     .join(", ");
// }

function getCourseTitlesFromIds(courseIds, courses) {
  if (!Array.isArray(courseIds) || courseIds.length === 0) return "";

  const selectedIds = courseIds.map(String);

  return courses
    .filter((course) => selectedIds.includes(String(course._id)))
    .map((course) => course.name)
    .filter(Boolean)
    .join(", ");
}

export default function TutorAboutPage() {
  const { showAlert } = useAlert();

  const [tutor, setTutor] = useState(null);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const visibleCourses = useMemo(() => {
    return Array.isArray(courses) ? courses : [];
  }, [courses]);

  function buildFormFromTutor(tutorData, courseList) {
    const existingCourseIds =
      Array.isArray(tutorData?.courseIds) && tutorData.courseIds.length
        ? tutorData.courseIds.map((course) => normalizeId(course)).filter(Boolean)
        : tutorData?.courseId
        ? [normalizeId(tutorData.courseId)].filter(Boolean)
        : [];

    const derivedCategoryIds = deriveCategoryIdsFromCourseIds(
      existingCourseIds,
      courseList
    );

    const existingCategoryIds =
      derivedCategoryIds.length > 0
        ? derivedCategoryIds
        : Array.isArray(tutorData?.categoryIds) && tutorData.categoryIds.length
        ? tutorData.categoryIds.map((cat) => normalizeId(cat)).filter(Boolean)
        : tutorData?.categoryId
        ? [normalizeId(tutorData.categoryId)].filter(Boolean)
        : [];

    return {
      name: tutorData?.name || "",
      email: tutorData?.email || "",
      phone: tutorData?.phone || "",
      qualification: tutorData?.qualification || "",
      about: tutorData?.about || "",
      subjects: Array.isArray(tutorData?.subjects)
        ? tutorData.subjects.join(", ")
        : tutorData?.subjects || "",
      categoryIds: existingCategoryIds,
      syllabus:
        tutorData?.syllabus &&
        tutorData.syllabus !== "none" &&
        tutorData.syllabus !== "Not added"
          ? tutorData.syllabus
          : "",
      courseIds: existingCourseIds,
      photo: null,
    };
  }

  function fillFormFromTutor(tutorData, courseList = courses) {
    setForm(buildFormFromTutor(tutorData, courseList));
    setPreview(tutorData?.photo ? getImageSrc(tutorData.photo) : "");
  }

  async function fetchData() {
    try {
      setLoading(true);

      const [profileRes, optionRes] = await Promise.all([
        api.get("/tutor/about/me"),
        api.get("/tutor/about/options"),
      ]);

      const tutorData = profileRes.data?.tuter || null;
      const categoryList = optionRes.data?.categories || [];
      const courseList = optionRes.data?.courses || [];

      setTutor(tutorData);
      setCategories(categoryList);
      setCourses(courseList);

      if (tutorData) {
        setForm(buildFormFromTutor(tutorData, courseList));
        setPreview(tutorData?.photo ? getImageSrc(tutorData.photo) : "");
      }
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load tutor about"), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function saveTutorAbout(e) {
    e.preventDefault();

    if (saving) return;

    try {
      if (!form.name.trim()) {
        return showAlert("Tutor name required", "error");
      }

      if (!form.email.trim()) {
        return showAlert("Tutor email required", "error");
      }

      if (!form.phone.trim()) {
        return showAlert("Tutor phone required", "error");
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

      if (form.photo) {
        fd.append("photo", form.photo);
      }

      setSaving(true);

      const { data } = await api.put("/tutor/about/me", fd);

      const updatedTutor = data?.tuter || null;

      if (updatedTutor) {
        setTutor(updatedTutor);
        fillFormFromTutor(updatedTutor, courses);
      }

      if (data?.user) {
        const oldUser = JSON.parse(localStorage.getItem("user") || "{}");

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...oldUser,
            ...data.user,
          })
        );

        window.dispatchEvent(new Event("storage"));
      }

      showAlert("Tutor about updated successfully", "success");
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to update tutor about"), "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="tutor-about-page-state">Loading tutor about...</div>;
  }

  if (!tutor) {
    return <div className="tutor-about-page-state">Tutor profile not found.</div>;
  }

  return (
    <div className="tutor-about-page">
      <div className="tutor-about-hero-card">
        <div className="tutor-about-hero-left">
          <div className="tutor-about-avatar">
            {preview ? (
              <img src={preview} alt={form.name || "Tutor"} />
            ) : (
              <span>{form.name?.charAt(0)?.toUpperCase() || "T"}</span>
            )}
          </div>

          <div>
            <h2>{form.name || "Tutor"}</h2>
            <p>{form.qualification || "Qualification not added"}</p>
          </div>
        </div>

        <div className="tutor-about-hero-info">
          <p>
            <b>Email:</b> {form.email || "No email added"}
          </p>

          <p>
            <b>Phone:</b> {form.phone || "No phone added"}
          </p>

          {/* <p>
            <b>Syllabus:</b>{" "}
            {form.syllabus && String(form.syllabus).trim()
              ? form.syllabus
              : "Not added"}
          </p>

          <p>
            <b>Categories:</b>{" "}
            {getCategoryTitlesFromIds(form.categoryIds, categories) ||
              "Not selected"}
          </p> */}

          <p>
            <b>Courses:</b>{" "}
            {getCourseTitlesFromIds(form.courseIds, courses) || "Not selected"}
          </p>
        </div>
      </div>

      <form className="tutor-about-form" onSubmit={saveTutorAbout}>
        <div className="tutor-about-section-title">
          <h3>About Details</h3>
          <p>Update your tutor profile details shown to students.</p>
        </div>

        <div className="tutor-about-form-grid">
          <label className="tutor-about-field">
            <span>Tutor Photo</span>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          </label>

          <label className="tutor-about-field">
            <span>Name</span>
            <input name="name" value={form.name} onChange={handleChange} />
          </label>

          <label className="tutor-about-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label className="tutor-about-field">
            <span>Phone</span>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>

          <label className="tutor-about-field">
            <span>Qualification</span>
            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              placeholder="Example: BA English"
            />
          </label>

          <label className="tutor-about-field tutor-about-field--full">
            <span>Syllabus</span>
            <input
              type="text"
              name="syllabus"
              value={form.syllabus}
              onChange={handleChange}
              placeholder="Example: State, CBSE, ICSE"
            />
            <small className="tutor-about-help-text">
              Empty aakki save cheythal “Not added” aayi store aavum.
            </small>
          </label>

          <label className="tutor-about-field tutor-about-field--full">
            <span>About / Description</span>
            <textarea
              name="about"
              rows="5"
              value={form.about}
              onChange={handleChange}
              placeholder="Write about your teaching experience..."
            />
          </label>

          <label className="tutor-about-field tutor-about-field--full">
            <span>Subjects</span>
            <input
              name="subjects"
              value={form.subjects}
              onChange={handleChange}
              placeholder="Example: English, Mathematics, Physics"
            />
          </label>

          {/* <div className="tutor-about-field tutor-about-field--full">
            <span>Auto Selected Categories</span>

            <div className="tutor-about-auto-category-box">
              {form.categoryIds.length === 0 ? (
                <p className="tutor-about-empty">
                  Course select cheythal category automatic aayi select aavum
                </p>
              ) : (
                categories
                  .filter((cat) =>
                    form.categoryIds.map(String).includes(String(cat._id))
                  )
                  .map((cat) => (
                    <span key={cat._id} className="tutor-about-category-chip">
                      {cat.title}
                    </span>
                  ))
              )}
            </div>
          </div> */}

          <div className="tutor-about-field tutor-about-field--full">
            <span>Courses / Classes</span>

            <div className="tutor-about-check-list tutor-about-course-list">
              {visibleCourses.length === 0 ? (
                <p className="tutor-about-empty">No courses found</p>
              ) : (
                visibleCourses.map((course) => {
                  const checked = Array.isArray(form.courseIds)
                    ? form.courseIds.map(String).includes(String(course._id))
                    : false;

                  const category = getCourseCategory(course, categories);

                  return (
                    <label key={course._id} className="tutor-about-check-item">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          toggleCourseSelection(course._id, e.target.checked)
                        }
                      />

                      <span>
                        {getCourseLabel(course, categories)}
                        {category?.title ? <small>{category.title}</small> : null}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="tutor-about-actions">
          <button
            type="button"
            className="tutor-about-reset-btn"
            onClick={fetchData}
            disabled={saving}
          >
            Reset
          </button>

          <button type="submit" className="tutor-about-save-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Details"}
          </button>
        </div>
      </form>
    </div>
  );
}