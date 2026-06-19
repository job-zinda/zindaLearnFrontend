



// import TutorWelcomePage from "./Pages/TutorWelcomePage";
// import "./Pages/TutorWelcomePage.css";









// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./Components/ProtectedRoute";

// import AdminLayout from "./Components/AdminLayout";
// import LoginPage from "./Pages/Loginpage";
// import AdminHome from "./Pages/AdminHome";
// import AdminPlaceholder from "./Pages/AdminPlaceholder";
// import AdminCoursesPage from "./Pages/AdminCoursesPage";
// import AdminTutorsPage from "./Pages/AdminTutorsPage";
// import AdminTutorDetailsPage from "./Pages/AdminTutorDetailsPage";
// import AdminCourseTutorsPage from "./Pages/AdminCourseTutorsPage";
// import AdminStudentsPage from "./Pages/AdminStudentsPage";
// import AdminChatPage from "./Pages/AdminChatPage";
// import AdminDashboardPage from "./Pages/AdminDashboardPage";
// import AdminSettingsPage from "./Pages/AdminSettingsPage";
// import AdminFeedbackPage from "./Pages/AdminFeedbackPage";

// import StudentLayout from "./Components/StudentLayout";
// import StudentHome from "./Pages/StudentHome";
// import StudentPlaceholder from "./Pages/StudentPlaceholder";
// import StudentTutorsPage from "./Pages/StudentTutorsPage";
// import StudentTutorDetailsPage from "./Pages/StudentTutorDetailsPage";
// import StudentCoursesPage from "./Pages/StudentCoursesPage";
// import StudentCourseTutorsPage from "./Pages/StudentCourseTutorsPage";
// import StudentChatPage from "./Pages/StudentChatPage";
// import StudentSettingsPage from "./Pages/StudentSettingsPage";

// import "./style/admin-layout.css";
// import "./Pages/AdminCoursesPage.css";
// import "./Pages/AdminTutorsPage.css";
// import "./Pages/AdminTutorDetailsPage.css";
// import "./Pages/AdminStudentsPage.css";
// import "./Pages/AdminChatPage.css";
// import "./Pages/AdminDashboardPage.css";
// import "./Pages/AdminSettingsPage.css";
// import "./Pages/AdminFeedbackPage.css";

// import "./Pages/StudentHome.css";
// import "./Pages/StudentTutorsPage.css";
// import "./Pages/StudentTutorDetailsPage.css";
// import "./Pages/StudentCoursesPage.css";
// import "./Pages/StudentCourseTutorsPage.css";
// import "./Pages/StudentChatPage.css";
// import "./Pages/StudentSettingsPage.css";
// import "./Components/StudentBannerSection.css";
// import "./Components/StudentCategorySection.css";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/invite-login" element={<LoginPage />} />

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<AdminHome />} />
//           <Route path="dashboard" element={<AdminDashboardPage />} />
//           <Route path="students" element={<AdminStudentsPage />} />
//           <Route path="tutors" element={<AdminTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<AdminTutorDetailsPage />} />
//           <Route path="courses/:categoryId" element={<AdminCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<AdminCourseTutorsPage />}
//           />
//           <Route path="reviews" element={<AdminFeedbackPage />} />
//           <Route path="chats" element={<AdminChatPage />} />
//           <Route path="settings" element={<AdminSettingsPage />} />
//         </Route>

//         <Route
//           path="/student"
//           element={
//             <ProtectedRoute allowedRole="student">
//               <StudentLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<StudentHome />} />
//           <Route path="courses/:categoryId" element={<StudentCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<StudentCourseTutorsPage />}
//           />
//           <Route path="tutors" element={<StudentTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<StudentTutorDetailsPage />} />
//           <Route path="chats" element={<StudentChatPage />} />
//           <Route path="settings" element={<StudentSettingsPage />} />
//         </Route>
















// <Route
//   path="/tutor"
//   element={
//     <ProtectedRoute allowedRole="tutor">
//       <TutorWelcomePage />
//     </ProtectedRoute>
//   }
// />




//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }



















































// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./Components/ProtectedRoute";

// import AdminLayout from "./Components/AdminLayout";
// import LoginPage from "./Pages/Loginpage";
// import AdminHome from "./Pages/AdminHome";
// import AdminPlaceholder from "./Pages/AdminPlaceholder";
// import AdminCoursesPage from "./Pages/AdminCoursesPage";
// import AdminTutorsPage from "./Pages/AdminTutorsPage";
// import AdminTutorDetailsPage from "./Pages/AdminTutorDetailsPage";
// import AdminCourseTutorsPage from "./Pages/AdminCourseTutorsPage";
// import AdminStudentsPage from "./Pages/AdminStudentsPage";
// import AdminChatPage from "./Pages/AdminChatPage";
// import AdminDashboardPage from "./Pages/AdminDashboardPage";
// import AdminSettingsPage from "./Pages/AdminSettingsPage";
// import AdminFeedbackPage from "./Pages/AdminFeedbackPage";

// import StudentLayout from "./Components/StudentLayout";
// import StudentHome from "./Pages/StudentHome";
// import StudentPlaceholder from "./Pages/StudentPlaceholder";
// import StudentTutorsPage from "./Pages/StudentTutorsPage";
// import StudentTutorDetailsPage from "./Pages/StudentTutorDetailsPage";
// import StudentCoursesPage from "./Pages/StudentCoursesPage";
// import StudentCourseTutorsPage from "./Pages/StudentCourseTutorsPage";
// import StudentChatPage from "./Pages/StudentChatPage";
// import StudentSettingsPage from "./Pages/StudentSettingsPage";

// import TutorLayout from "./Components/TutorLayout";
// import TutorHomePage from "./Pages/TutorHomePage";
// import TutorPlaceholderPage from "./Pages/TutorPlaceholderPage";

// import "./style/admin-layout.css";
// import "./Pages/AdminCoursesPage.css";
// import "./Pages/AdminTutorsPage.css";
// import "./Pages/AdminTutorDetailsPage.css";
// import "./Pages/AdminStudentsPage.css";
// import "./Pages/AdminChatPage.css";
// import "./Pages/AdminDashboardPage.css";
// import "./Pages/AdminSettingsPage.css";
// import "./Pages/AdminFeedbackPage.css";

// import "./Pages/StudentHome.css";
// import "./Pages/StudentTutorsPage.css";
// import "./Pages/StudentTutorDetailsPage.css";
// import "./Pages/StudentCoursesPage.css";
// import "./Pages/StudentCourseTutorsPage.css";
// import "./Pages/StudentChatPage.css";
// import "./Pages/StudentSettingsPage.css";
// import "./Components/StudentBannerSection.css";
// import "./Components/StudentCategorySection.css";

// import "./Pages/TutorPlaceholderPage.css";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/invite-login" element={<LoginPage />} />

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<AdminHome />} />
//           <Route path="dashboard" element={<AdminDashboardPage />} />
//           <Route path="students" element={<AdminStudentsPage />} />
//           <Route path="tutors" element={<AdminTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<AdminTutorDetailsPage />} />
//           <Route path="courses/:categoryId" element={<AdminCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<AdminCourseTutorsPage />}
//           />
//           <Route path="reviews" element={<AdminFeedbackPage />} />
//           <Route path="chats" element={<AdminChatPage />} />
//           <Route path="settings" element={<AdminSettingsPage />} />
//         </Route>

//         <Route
//           path="/student"
//           element={
//             <ProtectedRoute allowedRole="student">
//               <StudentLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<StudentHome />} />
//           <Route path="courses/:categoryId" element={<StudentCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<StudentCourseTutorsPage />}
//           />
//           <Route path="tutors" element={<StudentTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<StudentTutorDetailsPage />} />
//           <Route path="chats" element={<StudentChatPage />} />
//           <Route path="settings" element={<StudentSettingsPage />} />
//         </Route>

//         <Route
//           path="/tutor"
//           element={
//             <ProtectedRoute allowedRole="tutor">
//               <TutorLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<TutorHomePage />} />
//           <Route
//             path="tutors"
//             element={<TutorPlaceholderPage title="Tutors" />}
//           />
//           <Route
//             path="about"
//             element={<TutorPlaceholderPage title="About" />}
//           />
//           <Route
//             path="chats"
//             element={<TutorPlaceholderPage title="Chats" />}
//           />
//           <Route
//             path="settings"
//             element={<TutorPlaceholderPage title="Settings" />}
//           />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }







































// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./Components/ProtectedRoute";

// /* ---------------- ADMIN ---------------- */

// import AdminLayout from "./Components/AdminLayout";

// import LoginPage from "./Pages/Loginpage";
// import AdminHome from "./Pages/AdminHome";
// import AdminCoursesPage from "./Pages/AdminCoursesPage";
// import AdminTutorsPage from "./Pages/AdminTutorsPage";
// import AdminTutorDetailsPage from "./Pages/AdminTutorDetailsPage";
// import AdminCourseTutorsPage from "./Pages/AdminCourseTutorsPage";
// import AdminStudentsPage from "./Pages/AdminStudentsPage";
// import AdminChatPage from "./Pages/AdminChatPage";
// import AdminDashboardPage from "./Pages/AdminDashboardPage";
// import AdminSettingsPage from "./Pages/AdminSettingsPage";
// import AdminFeedbackPage from "./Pages/AdminFeedbackPage";

// /* ---------------- STUDENT ---------------- */

// import StudentLayout from "./Components/StudentLayout";

// import StudentHome from "./Pages/StudentHome";
// import StudentTutorsPage from "./Pages/StudentTutorsPage";
// import StudentTutorDetailsPage from "./Pages/StudentTutorDetailsPage";
// import StudentCoursesPage from "./Pages/StudentCoursesPage";
// import StudentCourseTutorsPage from "./Pages/StudentCourseTutorsPage";
// import StudentChatPage from "./Pages/StudentChatPage";
// import StudentSettingsPage from "./Pages/StudentSettingsPage";

// /* ---------------- TUTOR ---------------- */

// import TutorLayout from "./Components/TutorLayout";

// import TutorHomePage from "./Pages/TutorHomePage";
// import TutorPlaceholderPage from "./Pages/TutorPlaceholderPage";

// /* ---------------- CSS ---------------- */

// import "./style/admin-layout.css";

// /* admin css */

// import "./Pages/AdminCoursesPage.css";
// import "./Pages/AdminTutorsPage.css";
// import "./Pages/AdminTutorDetailsPage.css";
// import "./Pages/AdminStudentsPage.css";
// import "./Pages/AdminChatPage.css";
// import "./Pages/AdminDashboardPage.css";
// import "./Pages/AdminSettingsPage.css";
// import "./Pages/AdminFeedbackPage.css";

// /* student css */

// import "./Pages/StudentHome.css";
// import "./Pages/StudentTutorsPage.css";
// import "./Pages/StudentTutorDetailsPage.css";
// import "./Pages/StudentCoursesPage.css";
// import "./Pages/StudentCourseTutorsPage.css";
// import "./Pages/StudentChatPage.css";
// import "./Pages/StudentSettingsPage.css";

// import "./Components/StudentBannerSection.css";
// import "./Components/StudentCategorySection.css";

// /* tutor css */

// import "./Pages/TutorHomePage.css";
// import "./Pages/TutorPlaceholderPage.css";

// import "./Components/TutorBannerSection.css";
// import "./Components/TutorCategorySection.css";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* ---------------- LOGIN ---------------- */}

//         <Route path="/" element={<LoginPage />} />
//         <Route path="/invite-login" element={<LoginPage />} />

//         {/* ---------------- ADMIN ---------------- */}

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<AdminHome />} />

//           <Route path="dashboard" element={<AdminDashboardPage />} />

//           <Route path="students" element={<AdminStudentsPage />} />

//           <Route path="tutors" element={<AdminTutorsPage />} />

//           <Route
//             path="tutors/:tuterId"
//             element={<AdminTutorDetailsPage />}
//           />

//           <Route
//             path="courses/:categoryId"
//             element={<AdminCoursesPage />}
//           />

//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<AdminCourseTutorsPage />}
//           />

//           <Route path="reviews" element={<AdminFeedbackPage />} />

//           <Route path="chats" element={<AdminChatPage />} />

//           <Route path="settings" element={<AdminSettingsPage />} />
//         </Route>

//         {/* ---------------- STUDENT ---------------- */}

//         <Route
//           path="/student"
//           element={
//             <ProtectedRoute allowedRole="student">
//               <StudentLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<StudentHome />} />

//           <Route
//             path="courses/:categoryId"
//             element={<StudentCoursesPage />}
//           />

//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<StudentCourseTutorsPage />}
//           />

//           <Route path="tutors" element={<StudentTutorsPage />} />

//           <Route
//             path="tutors/:tuterId"
//             element={<StudentTutorDetailsPage />}
//           />

//           <Route path="chats" element={<StudentChatPage />} />

//           <Route path="settings" element={<StudentSettingsPage />} />
//         </Route>

//         {/* ---------------- TUTOR ---------------- */}

//         <Route
//           path="/tutor"
//           element={
//             <ProtectedRoute allowedRole="tutor">
//               <TutorLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<TutorHomePage />} />

//           <Route
//             path="tutors"
//             element={<TutorPlaceholderPage title="Tutors" />}
//           />

//           <Route
//             path="about"
//             element={<TutorPlaceholderPage title="About" />}
//           />

//           <Route
//             path="chats"
//             element={<TutorPlaceholderPage title="Chats" />}
//           />

//           <Route
//             path="settings"
//             element={<TutorPlaceholderPage title="Settings" />}
//           />
//         </Route>

//         {/* ---------------- FALLBACK ---------------- */}

//         <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }
























































// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./Components/ProtectedRoute";

// /* ADMIN */
// import AdminLayout from "./Components/AdminLayout";
// import LoginPage from "./Pages/Loginpage";
// import AdminHome from "./Pages/AdminHome";
// import AdminCoursesPage from "./Pages/AdminCoursesPage";
// import AdminTutorsPage from "./Pages/AdminTutorsPage";
// import AdminTutorDetailsPage from "./Pages/AdminTutorDetailsPage";
// import AdminCourseTutorsPage from "./Pages/AdminCourseTutorsPage";
// import AdminStudentsPage from "./Pages/AdminStudentsPage";
// import AdminChatPage from "./Pages/AdminChatPage";
// import AdminDashboardPage from "./Pages/AdminDashboardPage";
// import AdminSettingsPage from "./Pages/AdminSettingsPage";
// import AdminFeedbackPage from "./Pages/AdminFeedbackPage";

// /* STUDENT */
// import StudentLayout from "./Components/StudentLayout";
// import StudentHome from "./Pages/StudentHome";
// import StudentTutorsPage from "./Pages/StudentTutorsPage";
// import StudentTutorDetailsPage from "./Pages/StudentTutorDetailsPage";
// import StudentCoursesPage from "./Pages/StudentCoursesPage";
// import StudentCourseTutorsPage from "./Pages/StudentCourseTutorsPage";
// import StudentChatPage from "./Pages/StudentChatPage";
// import StudentSettingsPage from "./Pages/StudentSettingsPage";

// /* TUTOR */
// import TutorLayout from "./Components/TutorLayout";
// import TutorHomePage from "./Pages/TutorHomePage";
// import TutorCoursesPage from "./Pages/TutorCoursesPage";
// import TutorPlaceholderPage from "./Pages/TutorPlaceholderPage";

// /* CSS */
// import "./style/admin-layout.css";

// import "./Pages/AdminCoursesPage.css";
// import "./Pages/AdminTutorsPage.css";
// import "./Pages/AdminTutorDetailsPage.css";
// import "./Pages/AdminStudentsPage.css";
// import "./Pages/AdminChatPage.css";
// import "./Pages/AdminDashboardPage.css";
// import "./Pages/AdminSettingsPage.css";
// import "./Pages/AdminFeedbackPage.css";

// import "./Pages/StudentHome.css";
// import "./Pages/StudentTutorsPage.css";
// import "./Pages/StudentTutorDetailsPage.css";
// import "./Pages/StudentCoursesPage.css";
// import "./Pages/StudentCourseTutorsPage.css";
// import "./Pages/StudentChatPage.css";
// import "./Pages/StudentSettingsPage.css";

// import "./Components/StudentBannerSection.css";
// import "./Components/StudentCategorySection.css";

// import "./Pages/TutorHomePage.css";
// import "./Pages/TutorCoursesPage.css";
// import "./Pages/TutorPlaceholderPage.css";

// import "./Components/TutorBannerSection.css";
// import "./Components/TutorCategorySection.css";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/invite-login" element={<LoginPage />} />

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<AdminHome />} />
//           <Route path="dashboard" element={<AdminDashboardPage />} />
//           <Route path="students" element={<AdminStudentsPage />} />
//           <Route path="tutors" element={<AdminTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<AdminTutorDetailsPage />} />
//           <Route path="courses/:categoryId" element={<AdminCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<AdminCourseTutorsPage />}
//           />
//           <Route path="reviews" element={<AdminFeedbackPage />} />
//           <Route path="chats" element={<AdminChatPage />} />
//           <Route path="settings" element={<AdminSettingsPage />} />
//         </Route>

//         <Route
//           path="/student"
//           element={
//             <ProtectedRoute allowedRole="student">
//               <StudentLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<StudentHome />} />
//           <Route path="courses/:categoryId" element={<StudentCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<StudentCourseTutorsPage />}
//           />
//           <Route path="tutors" element={<StudentTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<StudentTutorDetailsPage />} />
//           <Route path="chats" element={<StudentChatPage />} />
//           <Route path="settings" element={<StudentSettingsPage />} />
//         </Route>

//         <Route
//           path="/tutor"
//           element={
//             <ProtectedRoute allowedRole="tutor">
//               <TutorLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<TutorHomePage />} />
//           <Route path="courses/:categoryId" element={<TutorCoursesPage />} />
//           <Route
//             path="tutors"
//             element={<TutorPlaceholderPage title="Tutors" />}
//           />
//           <Route
//             path="about"
//             element={<TutorPlaceholderPage title="About" />}
//           />
//           <Route
//             path="chats"
//             element={<TutorPlaceholderPage title="Chats" />}
//           />
//           <Route
//             path="settings"
//             element={<TutorPlaceholderPage title="Settings" />}
//           />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }




























































































// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./Components/ProtectedRoute";

// /* ADMIN */
// import AdminLayout from "./Components/AdminLayout";
// import LoginPage from "./Pages/Loginpage";
// import AdminHome from "./Pages/AdminHome";
// import AdminCoursesPage from "./Pages/AdminCoursesPage";
// import AdminTutorsPage from "./Pages/AdminTutorsPage";
// import AdminTutorDetailsPage from "./Pages/AdminTutorDetailsPage";
// import AdminCourseTutorsPage from "./Pages/AdminCourseTutorsPage";
// import AdminStudentsPage from "./Pages/AdminStudentsPage";
// import AdminChatPage from "./Pages/AdminChatPage";
// import AdminDashboardPage from "./Pages/AdminDashboardPage";
// import AdminSettingsPage from "./Pages/AdminSettingsPage";
// import AdminFeedbackPage from "./Pages/AdminFeedbackPage";

// /* STUDENT */
// import StudentLayout from "./Components/StudentLayout";
// import StudentHome from "./Pages/StudentHome";
// import StudentTutorsPage from "./Pages/StudentTutorsPage";
// import StudentTutorDetailsPage from "./Pages/StudentTutorDetailsPage";
// import StudentCoursesPage from "./Pages/StudentCoursesPage";
// import StudentCourseTutorsPage from "./Pages/StudentCourseTutorsPage";
// import StudentChatPage from "./Pages/StudentChatPage";
// import StudentSettingsPage from "./Pages/StudentSettingsPage";

// /* TUTOR */
// import TutorLayout from "./Components/TutorLayout";
// import TutorHomePage from "./Pages/TutorHomePage";
// import TutorCoursesPage from "./Pages/TutorCoursesPage";
// import TutorCourseTutorsPage from "./Pages/TutorCourseTutorsPage";
// import TutorPlaceholderPage from "./Pages/TutorPlaceholderPage";

// /* CSS */
// import "./style/admin-layout.css";

// import "./Pages/AdminCoursesPage.css";
// import "./Pages/AdminTutorsPage.css";
// import "./Pages/AdminTutorDetailsPage.css";
// import "./Pages/AdminStudentsPage.css";
// import "./Pages/AdminChatPage.css";
// import "./Pages/AdminDashboardPage.css";
// import "./Pages/AdminSettingsPage.css";
// import "./Pages/AdminFeedbackPage.css";

// import "./Pages/StudentHome.css";
// import "./Pages/StudentTutorsPage.css";
// import "./Pages/StudentTutorDetailsPage.css";
// import "./Pages/StudentCoursesPage.css";
// import "./Pages/StudentCourseTutorsPage.css";
// import "./Pages/StudentChatPage.css";
// import "./Pages/StudentSettingsPage.css";

// import "./Components/StudentBannerSection.css";
// import "./Components/StudentCategorySection.css";

// import "./Pages/TutorHomePage.css";
// import "./Pages/TutorCoursesPage.css";
// import "./Pages/TutorCourseTutorsPage.css";
// import "./Pages/TutorPlaceholderPage.css";

// import "./Components/TutorBannerSection.css";
// import "./Components/TutorCategorySection.css";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/invite-login" element={<LoginPage />} />

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<AdminHome />} />
//           <Route path="dashboard" element={<AdminDashboardPage />} />
//           <Route path="students" element={<AdminStudentsPage />} />
//           <Route path="tutors" element={<AdminTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<AdminTutorDetailsPage />} />
//           <Route path="courses/:categoryId" element={<AdminCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<AdminCourseTutorsPage />}
//           />
//           <Route path="reviews" element={<AdminFeedbackPage />} />
//           <Route path="chats" element={<AdminChatPage />} />
//           <Route path="settings" element={<AdminSettingsPage />} />
//         </Route>

//         <Route
//           path="/student"
//           element={
//             <ProtectedRoute allowedRole="student">
//               <StudentLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<StudentHome />} />
//           <Route path="courses/:categoryId" element={<StudentCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<StudentCourseTutorsPage />}
//           />
//           <Route path="tutors" element={<StudentTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<StudentTutorDetailsPage />} />
//           <Route path="chats" element={<StudentChatPage />} />
//           <Route path="settings" element={<StudentSettingsPage />} />
//         </Route>

//         <Route
//           path="/tutor"
//           element={
//             <ProtectedRoute allowedRole="tutor">
//               <TutorLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<TutorHomePage />} />
//           <Route path="courses/:categoryId" element={<TutorCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<TutorCourseTutorsPage />}
//           />
//           <Route
//             path="tutors"
//             element={<TutorPlaceholderPage title="Tutors" />}
//           />
//           <Route
//             path="about"
//             element={<TutorPlaceholderPage title="About" />}
//           />
//           <Route
//             path="chats"
//             element={<TutorPlaceholderPage title="Chats" />}
//           />
//           <Route
//             path="settings"
//             element={<TutorPlaceholderPage title="Settings" />}
//           />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }





























































































// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./Components/ProtectedRoute";

// /* ADMIN */
// import AdminLayout from "./Components/AdminLayout";
// import LoginPage from "./Pages/Loginpage";
// import AdminHome from "./Pages/AdminHome";
// import AdminCoursesPage from "./Pages/AdminCoursesPage";
// import AdminTutorsPage from "./Pages/AdminTutorsPage";
// import AdminTutorDetailsPage from "./Pages/AdminTutorDetailsPage";
// import AdminCourseTutorsPage from "./Pages/AdminCourseTutorsPage";
// import AdminStudentsPage from "./Pages/AdminStudentsPage";
// import AdminChatPage from "./Pages/AdminChatPage";
// import AdminDashboardPage from "./Pages/AdminDashboardPage";
// import AdminSettingsPage from "./Pages/AdminSettingsPage";
// import AdminFeedbackPage from "./Pages/AdminFeedbackPage";

// /* STUDENT */
// import StudentLayout from "./Components/StudentLayout";
// import StudentHome from "./Pages/StudentHome";
// import StudentTutorsPage from "./Pages/StudentTutorsPage";
// import StudentTutorDetailsPage from "./Pages/StudentTutorDetailsPage";
// import StudentCoursesPage from "./Pages/StudentCoursesPage";
// import StudentCourseTutorsPage from "./Pages/StudentCourseTutorsPage";
// import StudentChatPage from "./Pages/StudentChatPage";
// import StudentSettingsPage from "./Pages/StudentSettingsPage";

// /* TUTOR */
// import TutorLayout from "./Components/TutorLayout";
// import TutorHomePage from "./Pages/TutorHomePage";
// import TutorCoursesPage from "./Pages/TutorCoursesPage";
// import TutorCourseTutorsPage from "./Pages/TutorCourseTutorsPage";
// import TutorTutorsPage from "./Pages/TutorTutorsPage";
// import TutorPlaceholderPage from "./Pages/TutorPlaceholderPage";

// /* CSS */
// import "./style/admin-layout.css";

// import "./Pages/AdminCoursesPage.css";
// import "./Pages/AdminTutorsPage.css";
// import "./Pages/AdminTutorDetailsPage.css";
// import "./Pages/AdminStudentsPage.css";
// import "./Pages/AdminChatPage.css";
// import "./Pages/AdminDashboardPage.css";
// import "./Pages/AdminSettingsPage.css";
// import "./Pages/AdminFeedbackPage.css";

// import "./Pages/StudentHome.css";
// import "./Pages/StudentTutorsPage.css";
// import "./Pages/StudentTutorDetailsPage.css";
// import "./Pages/StudentCoursesPage.css";
// import "./Pages/StudentCourseTutorsPage.css";
// import "./Pages/StudentChatPage.css";
// import "./Pages/StudentSettingsPage.css";

// import "./Components/StudentBannerSection.css";
// import "./Components/StudentCategorySection.css";

// import "./Pages/TutorHomePage.css";
// import "./Pages/TutorCoursesPage.css";
// import "./Pages/TutorCourseTutorsPage.css";
// import "./Pages/TutorTutorsPage.css";
// import "./Pages/TutorPlaceholderPage.css";

// import "./Components/TutorBannerSection.css";
// import "./Components/TutorCategorySection.css";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/invite-login" element={<LoginPage />} />

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<AdminHome />} />
//           <Route path="dashboard" element={<AdminDashboardPage />} />
//           <Route path="students" element={<AdminStudentsPage />} />
//           <Route path="tutors" element={<AdminTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<AdminTutorDetailsPage />} />
//           <Route path="courses/:categoryId" element={<AdminCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<AdminCourseTutorsPage />}
//           />
//           <Route path="reviews" element={<AdminFeedbackPage />} />
//           <Route path="chats" element={<AdminChatPage />} />
//           <Route path="settings" element={<AdminSettingsPage />} />
//         </Route>

//         <Route
//           path="/student"
//           element={
//             <ProtectedRoute allowedRole="student">
//               <StudentLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<StudentHome />} />
//           <Route path="courses/:categoryId" element={<StudentCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<StudentCourseTutorsPage />}
//           />
//           <Route path="tutors" element={<StudentTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<StudentTutorDetailsPage />} />
//           <Route path="chats" element={<StudentChatPage />} />
//           <Route path="settings" element={<StudentSettingsPage />} />
//         </Route>

//         <Route
//           path="/tutor"
//           element={
//             <ProtectedRoute allowedRole="tutor">
//               <TutorLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<TutorHomePage />} />
//           <Route path="courses/:categoryId" element={<TutorCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<TutorCourseTutorsPage />}
//           />
//           <Route path="tutors" element={<TutorTutorsPage />} />
//           <Route
//             path="about"
//             element={<TutorPlaceholderPage title="About" />}
//           />
//           <Route
//             path="chats"
//             element={<TutorPlaceholderPage title="Chats" />}
//           />
//           <Route
//             path="settings"
//             element={<TutorPlaceholderPage title="Settings" />}
//           />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }




































// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./Components/ProtectedRoute";

// /* ADMIN */
// import AdminLayout from "./Components/AdminLayout";
// import LoginPage from "./Pages/Loginpage";
// import AdminHome from "./Pages/AdminHome";
// import AdminCoursesPage from "./Pages/AdminCoursesPage";
// import AdminTutorsPage from "./Pages/AdminTutorsPage";
// import AdminTutorDetailsPage from "./Pages/AdminTutorDetailsPage";
// import AdminCourseTutorsPage from "./Pages/AdminCourseTutorsPage";
// import AdminStudentsPage from "./Pages/AdminStudentsPage";
// import AdminChatPage from "./Pages/AdminChatPage";
// import AdminDashboardPage from "./Pages/AdminDashboardPage";
// import AdminSettingsPage from "./Pages/AdminSettingsPage";
// import AdminFeedbackPage from "./Pages/AdminFeedbackPage";

// /* STUDENT */
// import StudentLayout from "./Components/StudentLayout";
// import StudentHome from "./Pages/StudentHome";
// import StudentTutorsPage from "./Pages/StudentTutorsPage";
// import StudentTutorDetailsPage from "./Pages/StudentTutorDetailsPage";
// import StudentCoursesPage from "./Pages/StudentCoursesPage";
// import StudentCourseTutorsPage from "./Pages/StudentCourseTutorsPage";
// import StudentChatPage from "./Pages/StudentChatPage";
// import StudentSettingsPage from "./Pages/StudentSettingsPage";

// /* TUTOR */
// import TutorLayout from "./Components/TutorLayout";
// import TutorHomePage from "./Pages/TutorHomePage";
// import TutorCoursesPage from "./Pages/TutorCoursesPage";
// import TutorCourseTutorsPage from "./Pages/TutorCourseTutorsPage";
// import TutorTutorsPage from "./Pages/TutorTutorsPage";
// import TutorTutorDetailsPage from "./Pages/TutorTutorDetailsPage";
// import TutorPlaceholderPage from "./Pages/TutorPlaceholderPage";

// /* CSS */
// import "./style/admin-layout.css";

// import "./Pages/AdminCoursesPage.css";
// import "./Pages/AdminTutorsPage.css";
// import "./Pages/AdminTutorDetailsPage.css";
// import "./Pages/AdminStudentsPage.css";
// import "./Pages/AdminChatPage.css";
// import "./Pages/AdminDashboardPage.css";
// import "./Pages/AdminSettingsPage.css";
// import "./Pages/AdminFeedbackPage.css";

// import "./Pages/StudentHome.css";
// import "./Pages/StudentTutorsPage.css";
// import "./Pages/StudentTutorDetailsPage.css";
// import "./Pages/StudentCoursesPage.css";
// import "./Pages/StudentCourseTutorsPage.css";
// import "./Pages/StudentChatPage.css";
// import "./Pages/StudentSettingsPage.css";

// import "./Components/StudentBannerSection.css";
// import "./Components/StudentCategorySection.css";

// import "./Pages/TutorHomePage.css";
// import "./Pages/TutorCoursesPage.css";
// import "./Pages/TutorCourseTutorsPage.css";
// import "./Pages/TutorTutorsPage.css";
// import "./Pages/TutorTutorDetailsPage.css";
// import "./Pages/TutorPlaceholderPage.css";

// import "./Components/TutorBannerSection.css";
// import "./Components/TutorCategorySection.css";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/invite-login" element={<LoginPage />} />

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <AdminLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<AdminHome />} />
//           <Route path="dashboard" element={<AdminDashboardPage />} />
//           <Route path="students" element={<AdminStudentsPage />} />
//           <Route path="tutors" element={<AdminTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<AdminTutorDetailsPage />} />
//           <Route path="courses/:categoryId" element={<AdminCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<AdminCourseTutorsPage />}
//           />
//           <Route path="reviews" element={<AdminFeedbackPage />} />
//           <Route path="chats" element={<AdminChatPage />} />
//           <Route path="settings" element={<AdminSettingsPage />} />
//         </Route>

//         <Route
//           path="/student"
//           element={
//             <ProtectedRoute allowedRole="student">
//               <StudentLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<StudentHome />} />
//           <Route path="courses/:categoryId" element={<StudentCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<StudentCourseTutorsPage />}
//           />
//           <Route path="tutors" element={<StudentTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<StudentTutorDetailsPage />} />
//           <Route path="chats" element={<StudentChatPage />} />
//           <Route path="settings" element={<StudentSettingsPage />} />
//         </Route>

//         <Route
//           path="/tutor"
//           element={
//             <ProtectedRoute allowedRole="tutor">
//               <TutorLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<TutorHomePage />} />
//           <Route path="courses/:categoryId" element={<TutorCoursesPage />} />
//           <Route
//             path="courses/:categoryId/tutors/:courseId"
//             element={<TutorCourseTutorsPage />}
//           />
//           <Route path="tutors" element={<TutorTutorsPage />} />
//           <Route path="tutors/:tuterId" element={<TutorTutorDetailsPage />} />
//           <Route
//             path="about"
//             element={<TutorPlaceholderPage title="About" />}
//           />
//           <Route
//             path="chats"
//             element={<TutorPlaceholderPage title="Chats" />}
//           />
//           <Route
//             path="settings"
//             element={<TutorPlaceholderPage title="Settings" />}
//           />
//         </Route>

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


















































































import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";

/* ADMIN */
import AdminLayout from "./Components/AdminLayout";
import LoginPage from "./Pages/Loginpage";
import AdminHome from "./Pages/AdminHome";
import AdminCoursesPage from "./Pages/AdminCoursesPage";
import AdminTutorsPage from "./Pages/AdminTutorsPage";
import AdminTutorDetailsPage from "./Pages/AdminTutorDetailsPage";
import AdminCourseTutorsPage from "./Pages/AdminCourseTutorsPage";
import AdminStudentsPage from "./Pages/AdminStudentsPage";
import AdminChatPage from "./Pages/AdminChatPage";
import AdminDashboardPage from "./Pages/AdminDashboardPage";
import AdminSettingsPage from "./Pages/AdminSettingsPage";
import AdminFeedbackPage from "./Pages/AdminFeedbackPage";

/* STUDENT */
import StudentLayout from "./Components/StudentLayout";
import StudentHome from "./Pages/StudentHome";
import StudentTutorsPage from "./Pages/StudentTutorsPage";
import StudentTutorDetailsPage from "./Pages/StudentTutorDetailsPage";
import StudentCoursesPage from "./Pages/StudentCoursesPage";
import StudentCourseTutorsPage from "./Pages/StudentCourseTutorsPage";
import StudentChatPage from "./Pages/StudentChatPage";
import StudentSettingsPage from "./Pages/StudentSettingsPage";

/* TUTOR */
import TutorLayout from "./Components/TutorLayout";
import TutorHomePage from "./Pages/TutorHomePage";
import TutorCoursesPage from "./Pages/TutorCoursesPage";
import TutorCourseTutorsPage from "./Pages/TutorCourseTutorsPage";
import TutorTutorsPage from "./Pages/TutorTutorsPage";
import TutorTutorDetailsPage from "./Pages/TutorTutorDetailsPage";
import TutorSettingsPage from "./Pages/TutorSettingsPage";
import TutorPlaceholderPage from "./Pages/TutorPlaceholderPage";
import TutorAboutPage from "./Pages/TutorAboutPage";
import TutorChatPage from "./Pages/TutorChatPage";

import TutorMyStudentsPage from "./Pages/TutorMyStudentsPage";

/* CSS */
import "./style/admin-layout.css";

import "./Pages/AdminCoursesPage.css";
import "./Pages/AdminTutorsPage.css";
import "./Pages/AdminTutorDetailsPage.css";
import "./Pages/AdminStudentsPage.css";
import "./Pages/AdminChatPage.css";
import "./Pages/AdminDashboardPage.css";
import "./Pages/AdminSettingsPage.css";
import "./Pages/AdminFeedbackPage.css";

import "./Pages/StudentHome.css";
import "./Pages/StudentTutorsPage.css";
import "./Pages/StudentTutorDetailsPage.css";
import "./Pages/StudentCoursesPage.css";
import "./Pages/StudentCourseTutorsPage.css";
import "./Pages/StudentChatPage.css";
import "./Pages/StudentSettingsPage.css";

import "./Components/StudentBannerSection.css";
import "./Components/StudentCategorySection.css";

import "./Pages/TutorHomePage.css";
import "./Pages/TutorCoursesPage.css";
import "./Pages/TutorCourseTutorsPage.css";
import "./Pages/TutorTutorsPage.css";
import "./Pages/TutorTutorDetailsPage.css";
import "./Pages/TutorSettingsPage.css";
import "./Pages/TutorPlaceholderPage.css";

import "./Components/TutorBannerSection.css";
import "./Components/TutorCategorySection.css";
import "./Pages/TutorAboutPage.css";
import "./Pages/TutorChatPage.css";

import "./Pages/TutorMyStudentsPage.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/invite-login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHome />} />

          <Route path="dashboard" element={<AdminDashboardPage />} />

          <Route path="students" element={<AdminStudentsPage />} />

          <Route path="tutors" element={<AdminTutorsPage />} />

          <Route
            path="tutors/:tuterId"
            element={<AdminTutorDetailsPage />}
          />

          <Route
            path="courses/:categoryId"
            element={<AdminCoursesPage />}
          />

          <Route
            path="courses/:categoryId/tutors/:courseId"
            element={<AdminCourseTutorsPage />}
          />

          <Route path="reviews" element={<AdminFeedbackPage />} />

          <Route path="chats" element={<AdminChatPage />} />

          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentHome />} />

          <Route
            path="courses/:categoryId"
            element={<StudentCoursesPage />}
          />

          <Route
            path="courses/:categoryId/tutors/:courseId"
            element={<StudentCourseTutorsPage />}
          />

          <Route path="tutors" element={<StudentTutorsPage />} />

          <Route
            path="tutors/:tuterId"
            element={<StudentTutorDetailsPage />}
          />

          <Route path="chats" element={<StudentChatPage />} />

          <Route path="settings" element={<StudentSettingsPage />} />
        </Route>

        <Route
          path="/tutor"
          element={
            <ProtectedRoute allowedRole="tutor">
              <TutorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TutorHomePage />} />

          <Route
            path="courses/:categoryId"
            element={<TutorCoursesPage />}
          />

          <Route
            path="courses/:categoryId/tutors/:courseId"
            element={<TutorCourseTutorsPage />}
          />

          <Route path="tutors" element={<TutorTutorsPage />} />

     <Route path="my-students" element={<TutorMyStudentsPage />} />

          <Route
            path="tutors/:tuterId"
            element={<TutorTutorDetailsPage />}
          />

          {/* <Route
            path="about"
            element={<TutorPlaceholderPage title="About" />}
          /> */}

          <Route path="about" element={<TutorAboutPage />} />

          {/* <Route
            path="chats"
            element={<TutorPlaceholderPage title="Chats" />}
          /> */}


<Route path="chats" element={<TutorChatPage />} />



          <Route path="settings" element={<TutorSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}