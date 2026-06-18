


import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiEye } from "react-icons/fi";


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




// function formatAssignedDate(value) {
//   if (!value) return "";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return "";

//   return date
//     .toLocaleString("en-US", {
//       month: "short",
//       day: "2-digit",
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     })
//     .replace(",", "");
// }










function formatAssignedDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}








// const studentFilterOptions = [
//   {
//     key: "all",
//     label: "All Students",
//   },
//   {
//     key: "blocked",
//     label: "Blocked Students",
//   },
// ];






// const studentFilterOptions = [
//   {
//     key: "all",
//     label: "All Students",
//   },
//   {
//     key: "active",
//     label: "Active Students",
//   },
//   {
//     key: "blocked",
//     label: "Blocked Students",
//   },
// ];








const studentFilterOptions = [
  {
    key: "all",
    label: "All Students",
  },
  {
    key: "new",
    label: "New Signups",
  },
  {
    key: "active",
    label: "Active Students",
  },
  {
    key: "blocked",
    label: "Blocked Students",
  },
];







// const studentFilterLabels = {
//   all: "All Students",
//   blocked: "Blocked Students",
// };



// const studentFilterLabels = {
//   all: "All Students",
//   active: "Active Students",
//   blocked: "Blocked Students",
// };





const studentFilterLabels = {
  all: "All Students",
  new: "New Signups",
  active: "Active Students",
  blocked: "Blocked Students",
};




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











// function StudentInviteIcon() {
//   return (
//     <span className="student-invite-btn__icon" aria-hidden="true">
//       <span className="student-invite-btn__plus">+</span>

//       <svg
//         className="student-invite-btn__user"
//         viewBox="0 0 24 24"
//         fill="none"
//       >
//         <circle cx="12" cy="8" r="4" />
//         <path d="M4.5 21c.8-4 3.6-6 7.5-6s6.7 2 7.5 6" />
//       </svg>
//     </span>
//   );







// }







function StudentInviteIcon() {
  return (
    <span className="student-invite-btn__icon" aria-hidden="true">
      <svg
        className="student-invite-btn__mail"
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          d="M4 10.5V23H24V10.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M4 10.5L14 17.5L24 10.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M4 10.5L14 4L24 10.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M14 7V14"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M10.5 10.5H17.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}









function StudentFilterIcon() {
  return (
    <svg
      className="student-filter-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6h16L14 13v5.2c0 .35-.18.67-.48.86l-3 1.9A1 1 0 0 1 9 20.1V13L4 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 6h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}









function AssignedTutorsMenuIcon() {
  return (
    <svg className="assigned-tutors-menu-icon" viewBox="0 0 24 24" fill="none">
      <path d="M6 20V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="2" />
      <path d="M11 6H20V17H11" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 10L17 8V15L14 13" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}






export default function AdminStudentsPage() {
  const { showAlert } = useAlert();
  const location = useLocation();
  const navigate = useNavigate();
  const firstNewCardRef = useRef(null);



const tutorModalRestoreDoneRef = useRef(false);




  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);





const [studentFilter, setStudentFilter] = useState("all");
const [filterOpen, setFilterOpen] = useState(false);
const filterWrapRef = useRef(null);






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





  const [assignedTutorDates, setAssignedTutorDates] = useState({});


const [newAssignTutorIds, setNewAssignTutorIds] = useState([]);

const [assignedViewOpen, setAssignedViewOpen] = useState(false);
const [assignedViewStudent, setAssignedViewStudent] = useState(null);
const [assignedViewSearch, setAssignedViewSearch] = useState("");
const [assignedViewLoading, setAssignedViewLoading] = useState(false);

const [studentAssignedCounts, setStudentAssignedCounts] = useState({});





const [removeAssignedTutorOpen, setRemoveAssignedTutorOpen] = useState(false);
const [removeAssignedTutorTarget, setRemoveAssignedTutorTarget] = useState(null);




  // const showOnlyNew =
  //   new URLSearchParams(location.search).get("filter") === "new";





const showOnlyNew = studentFilter === "new";





  // const filteredStudents = useMemo(() => {
  //   let result = students;

  //   if (showOnlyNew) {
  //     result = result.filter((student) => isNewStudent(student));
  //   }

  //   const q = search.toLowerCase().trim();

  //   if (!q) return result;

  //   return result.filter((student) => {
  //     return (
  //       String(student.name || "").toLowerCase().includes(q) ||
  //       String(student.email || "").toLowerCase().includes(q) ||
  //       String(student.phone || "").toLowerCase().includes(q)
  //     );
  //   });
  // }, [students, search, showOnlyNew]);





// const filteredStudents = useMemo(() => {
//   let result = students;

//   if (showOnlyNew) {
//     result = result.filter((student) => isNewStudent(student));
//   }

//   if (studentFilter === "blocked") {
//     result = result.filter((student) => isStudentBlocked(student));
//   }

//   const q = search.toLowerCase().trim();

//   if (!q) return result;

//   return result.filter((student) => {
//     return (
//       String(student.name || "").toLowerCase().includes(q) ||
//       String(student.email || "").toLowerCase().includes(q) ||
//       String(student.phone || "").toLowerCase().includes(q)
//     );
//   });
// }, [students, search, showOnlyNew, studentFilter]);









const filteredStudents = useMemo(() => {
  let result = students;

  if (showOnlyNew) {
    result = result.filter((student) => isNewStudent(student));
  }

  if (studentFilter === "active") {
    result = result.filter((student) => !isStudentBlocked(student));
  }

  if (studentFilter === "blocked") {
    result = result.filter((student) => isStudentBlocked(student));
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
}, [students, search, showOnlyNew, studentFilter]);








  // async function fetchStudents() {
  //   try {
  //     setLoading(true);

  //     const { data } = await api.get("/admin/student/all");
  //     setStudents(data.students || []);
  //   } catch (err) {
  //     showAlert(getErrorMessage(err, "Failed to load students"), "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // }









  async function fetchStudents() {
  try {
    setLoading(true);

    const { data } = await api.get("/admin/student/all");
    const list = data.students || [];

    setStudents(list);
    refreshStudentAssignedCounts(list);
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to load students"), "error");
  } finally {
    setLoading(false);
  }
}







  async function openStudentChat(student) {
    try {
      if (isStudentBlocked(student)) {
        showAlert("Blocked student chat is disabled", "error");
        return;
      }

      const studentId = getStudentId(student);

      if (!studentId) {
        return showAlert("Student id not found", "error");
      }

      const { data } = await api.post(`/chat/admin-student-room/${studentId}`);

      const roomId = data?.room?._id || data?.chatRoom?._id || data?.roomId;

      if (roomId) {
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
  const filterValue = new URLSearchParams(location.search).get("filter");

  if (filterValue === "new") {
    setStudentFilter("new");
  }
}, [location.search]);



useEffect(() => {
  function handleOutsideFilterClick(e) {
    if (
      filterWrapRef.current &&
      !filterWrapRef.current.contains(e.target)
    ) {
      setFilterOpen(false);
    }
  }

  document.addEventListener("mousedown", handleOutsideFilterClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideFilterClick);
  };
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











  // async function toggleStudentBlock(student) {

  //   try {

  //     const nextBlocked =
  //       !isStudentBlocked(student);

  //     const { data } = await api.patch(

  //       `/admin/student/block/${getStudentId(student)}`,

  //       {
  //         isBlocked: nextBlocked
  //       }

  //     );

  //     setStudents(prev =>

  //       prev.map(item =>

  //         getStudentId(item) ===
  //           getStudentId(student)

  //           ?

  //           {
  //             ...item,

  //             isBlocked:
  //               data?.student?.isBlocked
  //               ??

  //               nextBlocked

  //           }

  //           : item

  //       )

  //     )

  //     setMenuOpenId(null);

  //     showAlert(

  //       nextBlocked
  //         ?
  //         "Student blocked"
  //         :
  //         "Student unblocked",

  //       "success"

  //     )

  //   } catch (err) {

  //     showAlert(

  //       getErrorMessage(
  //         err,
  //         "Failed blocking student"
  //       ),

  //       "error"

  //     )

  //   }

  // }



async function toggleStudentBlock(student) {
  try {
    const studentId = getStudentId(student);

    if (!studentId) {
      return showAlert("Student id not found", "error");
    }

    const nextBlocked = !isStudentBlocked(student);

    const { data } = await api.patch(`/admin/student/block/${studentId}`, {
      isBlocked: nextBlocked,
    });

    const updatedBlocked =
      data?.student?.isBlocked ??
      data?.user?.isBlocked ??
      data?.data?.isBlocked ??
      nextBlocked;

    setStudents((prev) =>
      prev.map((item) =>
        String(getStudentId(item)) === String(studentId)
          ? {
              ...item,
              isBlocked: updatedBlocked,
            }
          : item
      )
    );

    setMenuOpenId(null);

    showAlert(
      updatedBlocked ? "Student blocked" : "Student unblocked",
      "success"
    );
  } catch (err) {
    showAlert(
      getErrorMessage(err, "Failed to update student block status"),
      "error"
    );
  }
}




function getAssignedCount(student) {
  const studentId = getStudentId(student);

  if (studentId && studentAssignedCounts[String(studentId)] !== undefined) {
    return Number(studentAssignedCounts[String(studentId)] || 0);
  }

  if (Array.isArray(student?.assignedTutors)) {
    return student.assignedTutors.length;
  }

  if (Array.isArray(student?.tutors)) {
    return student.tutors.length;
  }

  if (student?.assignedTutorsCount !== undefined) {
    return Number(student.assignedTutorsCount || 0);
  }

  if (student?.assignedTutorCount !== undefined) {
    return Number(student.assignedTutorCount || 0);
  }

  return 0;
}

async function refreshStudentAssignedCounts(studentList = students) {
  try {
    const entries = await Promise.all(
      (studentList || []).map(async (student) => {
        const studentId = getStudentId(student);

        if (!studentId) {
          return null;
        }

        try {
          const { data } = await api.get(
            `/admin/student/${studentId}/assigned-tutors`
          );

          // const count = (data.tutors || []).filter((tutor) => {
          //   return isTutorActive(tutor) && !isTutorBlocked(tutor);
          // }).length;




const count = (data.tutors || []).length;



          return [String(studentId), count];
        } catch {
          return [String(studentId), 0];
        }
      })
    );

    const nextCounts = {};

    entries.forEach((entry) => {
      if (entry) {
        nextCounts[entry[0]] = entry[1];
      }
    });

    setStudentAssignedCounts(nextCounts);
  } catch {
    // count load fail aayal page break aavaruth
  }
}




  // const filteredAssignTutors = useMemo(() => {
  //   const q = assignSearch.toLowerCase().trim();

  //   if (!q) return tutors;

  //   return tutors.filter((tutor) => {
  //     return (
  //       String(tutor.name || "").toLowerCase().includes(q) ||
  //       String(tutor.email || "").toLowerCase().includes(q) ||
  //       String(tutor.phone || "").toLowerCase().includes(q) ||
  //       String(tutor.qualification || "").toLowerCase().includes(q)
  //     );
  //   });
  // }, [tutors, assignSearch]);







// const availableAssignTutors = useMemo(() => {
//   return tutors.filter((tutor) => {
//     return isTutorActive(tutor) && !isTutorBlocked(tutor);
//   });
// }, [tutors]);

// const filteredAssignTutors = useMemo(() => {
//   const q = assignSearch.toLowerCase().trim();

//   if (!q) return availableAssignTutors;

//   return availableAssignTutors.filter((tutor) => {
//     return (
//       String(tutor.name || "").toLowerCase().includes(q) ||
//       String(tutor.email || "").toLowerCase().includes(q) ||
//       String(tutor.phone || "").toLowerCase().includes(q) ||
//       String(tutor.qualification || "").toLowerCase().includes(q)
//     );
//   });
// }, [availableAssignTutors, assignSearch]);









// const availableAssignTutors = useMemo(() => {
//   return tutors.filter((tutor) => {
//     return isTutorActive(tutor) && !isTutorBlocked(tutor);
//   });
// }, [tutors]);

// const unassignedAssignTutors = useMemo(() => {
//   const alreadyAssigned = assignedTutorIds.map(String);

//   return availableAssignTutors.filter((tutor) => {
//     return !alreadyAssigned.includes(String(tutor._id));
//   });
// }, [availableAssignTutors, assignedTutorIds]);

// const filteredAssignTutors = useMemo(() => {
//   const q = assignSearch.toLowerCase().trim();

//   const source = unassignedAssignTutors;

//   if (!q) return source;

//   return source.filter((tutor) => {
//     return (
//       String(tutor.name || "").toLowerCase().includes(q) ||
//       String(tutor.email || "").toLowerCase().includes(q) ||
//       String(tutor.phone || "").toLowerCase().includes(q) ||
//       String(tutor.qualification || "").toLowerCase().includes(q)
//     );
//   });
// }, [unassignedAssignTutors, assignSearch]);

// // const assignedViewTutors = useMemo(() => {
// //   const alreadyAssigned = assignedTutorIds.map(String);

// //   return availableAssignTutors.filter((tutor) => {
// //     return alreadyAssigned.includes(String(tutor._id));
// //   });
// // }, [availableAssignTutors, assignedTutorIds]);





// const assignedViewTutors = useMemo(() => {
//   const alreadyAssigned = assignedTutorIds.map(String);

//   return tutors.filter((tutor) => {
//     return alreadyAssigned.includes(String(tutor._id));
//   });
// }, [tutors, assignedTutorIds]);





// const filteredAssignedViewTutors = useMemo(() => {
//   const q = assignedViewSearch.toLowerCase().trim();

//   if (!q) return assignedViewTutors;

//   return assignedViewTutors.filter((tutor) => {
//     return (
//       String(tutor.name || "").toLowerCase().includes(q) ||
//       String(tutor.email || "").toLowerCase().includes(q) ||
//       String(tutor.phone || "").toLowerCase().includes(q) ||
//       String(tutor.qualification || "").toLowerCase().includes(q)
//     );
//   });
// }, [assignedViewTutors, assignedViewSearch]);





const availableAssignTutors = useMemo(() => {
  return tutors.filter((tutor) => {
    return isTutorActive(tutor) && !isTutorBlocked(tutor);
  });
}, [tutors]);

const unassignedAssignTutors = useMemo(() => {
  const alreadyAssigned = assignedTutorIds.map(String);

  return availableAssignTutors.filter((tutor) => {
    return !alreadyAssigned.includes(String(tutor._id));
  });
}, [availableAssignTutors, assignedTutorIds]);

const filteredAssignTutors = useMemo(() => {
  const q = assignSearch.toLowerCase().trim();

  const source = unassignedAssignTutors;

  if (!q) return source;

  return source.filter((tutor) => {
    return (
      String(tutor.name || "").toLowerCase().includes(q) ||
      String(tutor.email || "").toLowerCase().includes(q) ||
      String(tutor.phone || "").toLowerCase().includes(q) ||
      String(tutor.qualification || "").toLowerCase().includes(q)
    );
  });
}, [unassignedAssignTutors, assignSearch]);

const assignedViewTutors = useMemo(() => {
  const alreadyAssigned = assignedTutorIds.map(String);

  return tutors.filter((tutor) => {
    return alreadyAssigned.includes(String(tutor._id));
  });
}, [tutors, assignedTutorIds]);

const filteredAssignedViewTutors = useMemo(() => {
  const q = assignedViewSearch.toLowerCase().trim();

  if (!q) return assignedViewTutors;

  return assignedViewTutors.filter((tutor) => {
    return (
      String(tutor.name || "").toLowerCase().includes(q) ||
      String(tutor.email || "").toLowerCase().includes(q) ||
      String(tutor.phone || "").toLowerCase().includes(q) ||
      String(tutor.qualification || "").toLowerCase().includes(q)
    );
  });
}, [assignedViewTutors, assignedViewSearch]);





//   async function openAssignTutorModal(student) {
//     try {
//       setAssignStudent(student);
//       setAssignedTutorIds([]);
//       setAssignSearch("");
//       setAssignOpen(true);
//       setMenuOpenId(null);
//       setAssignLoading(true);

//       const { data } = await api.get(
//         `/admin/student/${getStudentId(student)}/assigned-tutors`
//       );

//       // const ids = (data.tutors || []).map((tutor) => tutor._id);
//       // setAssignedTutorIds(ids);





// const activeTutorIds = tutors
//   .filter((tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor))
//   .map((tutor) => String(tutor._id));

// // const ids = (data.tutors || [])
// //   .map((tutor) => String(tutor._id))
// //   .filter((id) => activeTutorIds.includes(id));

// // setAssignedTutorIds(ids);







// async function openAssignTutorModal(student) {
//   try {
//     setAssignStudent(student);
//     setAssignedTutorIds([]);
//     setAssignedTutorDates({});
//     setAssignSearch("");
//     setAssignOpen(true);
//     setMenuOpenId(null);
//     setAssignLoading(true);

//     const { data } = await api.get(
//       `/admin/student/${getStudentId(student)}/assigned-tutors`
//     );

//     const activeTutorIds = tutors
//       .filter((tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor))
//       .map((tutor) => String(tutor._id));

//     const ids = (data.tutors || [])
//       .map((tutor) => String(tutor._id))
//       .filter((id) => activeTutorIds.includes(id));

//     const dateMap = {};

//     (data.tutors || []).forEach((tutor) => {
//       const id = String(tutor._id);

//       if (activeTutorIds.includes(id) && tutor.assignedAt) {
//         dateMap[id] = tutor.assignedAt;
//       }
//     });

//     setAssignedTutorIds(ids);
//     setAssignedTutorDates(dateMap);
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to load assigned tutors"), "error");
//   } finally {
//     setAssignLoading(false);
//   }
// }








//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to load assigned tutors"), "error");
//     } finally {
//       setAssignLoading(false);
//     }
//   }























// async function openAssignTutorModal(student) {
//   try {
//     setAssignStudent(student);
//     setAssignedTutorIds([]);
//     setAssignedTutorDates({});
//     setAssignSearch("");
//     setAssignOpen(true);
//     setMenuOpenId(null);
//     setAssignLoading(true);

//     const [assignedResponse, tutorsResponse] = await Promise.all([
//       api.get(`/admin/student/${getStudentId(student)}/assigned-tutors`),
//       tutors.length
//         ? Promise.resolve({ data: { tuters: tutors } })
//         : api.get("/admin/tuter/all"),
//     ]);

//     const allTutors = tutorsResponse.data.tuters || [];

//     if (!tutors.length) {
//       setTutors(allTutors);
//     }

//     const activeTutorIds = allTutors
//       .filter((tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor))
//       .map((tutor) => String(tutor._id));

//     const assignedTutors = assignedResponse.data.tutors || [];

//     const ids = assignedTutors
//       .map((tutor) => String(tutor._id))
//       .filter((id) => activeTutorIds.includes(id));

//     const dateMap = {};

//     assignedTutors.forEach((tutor) => {
//       const id = String(tutor._id);

//       if (activeTutorIds.includes(id)) {
//         dateMap[id] = tutor.assignedAt || tutor.createdAt || null;
//       }
//     });

//     setAssignedTutorIds(ids);
//     setAssignedTutorDates(dateMap);
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to load assigned tutors"), "error");
//   } finally {
//     setAssignLoading(false);
//   }
// }








// function goToTutorDetailsFromStudentModal(tutor, modalType, student) {
//   if (!tutor?._id || !student) {
//     showAlert("Tutor or student not found", "error");
//     return;
//   }

//   const restoreData = {
//     studentId: String(getStudentId(student)),
//     modalType, // "assign" or "assigned"
//   };

//   sessionStorage.setItem(
//     "adminStudentTutorModalRestore",
//     JSON.stringify(restoreData)
//   );

//   const backData = {
//     backTo: "/admin/students",
//     backButtonLabel: "Tutors",
//     backLabel: "View details",
//   };

//   sessionStorage.setItem("adminTutorBackData", JSON.stringify(backData));

//   navigate(`/admin/tutors/${tutor._id}`, {
//     state: backData,
//   });
// }



// function goToTutorDetailsFromStudentModal(tutor, modalType, student) {
//   if (!tutor?._id || !student) {
//     showAlert("Tutor or student not found", "error");
//     return;
//   }

//   const restoreData = {
//     studentId: String(getStudentId(student)),
//     modalType, // "assign" or "assigned"
//   };

//   sessionStorage.setItem(
//     "adminStudentTutorModalRestore",
//     JSON.stringify(restoreData)
//   );

//   const backData = {
//     backTo: "/admin/students",
//     backButtonLabel: modalType === "assigned" ? "assignedtutors" : "assigntutors",
//     backLabel: "View details",
//   };

//   sessionStorage.setItem("adminTutorBackData", JSON.stringify(backData));

//   navigate(`/admin/tutors/${tutor._id}`, {
//     state: backData,
//   });
// }







function goToTutorDetailsFromStudentModal(tutor, modalType, student) {
  if (!tutor?._id || !student) {
    showAlert("Tutor or student not found", "error");
    return;
  }

  const restoreData = {
    studentId: String(getStudentId(student)),
    modalType, // "assign" or "assigned"
  };

  sessionStorage.setItem(
    "adminStudentTutorModalRestore",
    JSON.stringify(restoreData)
  );

  const backData = {
    backTo: "/admin/students",
    backButtonLabel: modalType === "assigned" ? "assignedtutors" : "assigntutors",
    backLabel: "View details",
  };

  sessionStorage.setItem("adminTutorBackData", JSON.stringify(backData));

  navigate(`/admin/tutors/${tutor._id}`, {
    state: backData,
  });
}








async function openAssignTutorModal(student) {
  try {
    setAssignStudent(student);
    setAssignedTutorIds([]);
    setNewAssignTutorIds([]);
    setAssignedTutorDates({});
    setAssignSearch("");
    setAssignOpen(true);
    setMenuOpenId(null);
    setAssignLoading(true);

    const [assignedResponse, tutorsResponse] = await Promise.all([
      api.get(`/admin/student/${getStudentId(student)}/assigned-tutors`),
      tutors.length
        ? Promise.resolve({ data: { tuters: tutors } })
        : api.get("/admin/tuter/all"),
    ]);

    const allTutors = tutorsResponse.data.tuters || [];

    if (!tutors.length) {
      setTutors(allTutors);
    }

    // const activeTutorIds = allTutors
    //   .filter((tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor))
    //   .map((tutor) => String(tutor._id));

    // const assignedTutors = assignedResponse.data.tutors || [];

    // const ids = assignedTutors
    //   .map((tutor) => String(tutor._id))
    //   .filter((id) => activeTutorIds.includes(id));

    // const dateMap = {};

    // assignedTutors.forEach((tutor) => {
    //   const id = String(tutor._id);

    //   if (activeTutorIds.includes(id)) {
    //     dateMap[id] = tutor.assignedAt || tutor.createdAt || null;
    //   }
    // });





const assignedTutors = assignedResponse.data.tutors || [];

const ids = assignedTutors
  .map((tutor) => String(tutor._id))
  .filter(Boolean);

const dateMap = {};

assignedTutors.forEach((tutor) => {
  const id = String(tutor._id);

  if (id) {
    dateMap[id] = tutor.assignedAt || tutor.createdAt || null;
  }
});






    setAssignedTutorIds(ids);
    setAssignedTutorDates(dateMap);
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to load assigned tutors"), "error");
  } finally {
    setAssignLoading(false);
  }
}






  // function toggleAssignedTutor(tutorId, checked) {
  //   setAssignedTutorIds((prev) => {
  //     if (checked) {
  //       return Array.from(new Set([...prev, tutorId]));
  //     }

  //     return prev.filter((id) => id !== tutorId);
  //   });
  // }






// function toggleAssignedTutor(tutorId, checked) {
//   const cleanTutorId = String(tutorId);

//   setAssignedTutorIds((prev) => {
//     const currentIds = prev.map(String);

//     if (checked) {
//       return Array.from(new Set([...currentIds, cleanTutorId]));
//     }

//     return currentIds.filter((id) => id !== cleanTutorId);
//   });

//   if (!checked) {
//     setAssignedTutorDates((prev) => {
//       const next = { ...prev };
//       delete next[cleanTutorId];
//       return next;
//     });
//   }
// }








function toggleAssignedTutor(tutorId, checked) {
  const cleanTutorId = String(tutorId);

  setAssignedTutorIds((prev) => {
    const currentIds = prev.map(String);

    if (checked) {
      return Array.from(new Set([...currentIds, cleanTutorId]));
    }

    return currentIds.filter((id) => id !== cleanTutorId);
  });

  if (!checked) {
    setAssignedTutorDates((prev) => {
      const next = { ...prev };
      delete next[cleanTutorId];
      return next;
    });
  }
}









function toggleNewAssignTutor(tutorId, checked) {
  const cleanTutorId = String(tutorId);

  setNewAssignTutorIds((prev) => {
    const currentIds = prev.map(String);

    if (checked) {
      return Array.from(new Set([...currentIds, cleanTutorId]));
    }

    return currentIds.filter((id) => id !== cleanTutorId);
  });
}








// async function openAssignedTutorsModal(student) {
//   try {
//     setAssignedViewStudent(student);
//     setAssignedTutorIds([]);
//     setAssignedTutorDates({});
//     setAssignedViewSearch("");
//     setAssignedViewOpen(true);
//     setMenuOpenId(null);
//     setAssignedViewLoading(true);

//     const [assignedResponse, tutorsResponse] = await Promise.all([
//       api.get(`/admin/student/${getStudentId(student)}/assigned-tutors`),
//       tutors.length
//         ? Promise.resolve({ data: { tuters: tutors } })
//         : api.get("/admin/tuter/all"),
//     ]);

//     const allTutors = tutorsResponse.data.tuters || [];

//     if (!tutors.length) {
//       setTutors(allTutors);
//     }

//     // const activeTutorIds = allTutors
//     //   .filter((tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor))
//     //   .map((tutor) => String(tutor._id));

//     // const assignedTutors = assignedResponse.data.tutors || [];

//     // const ids = assignedTutors
//     //   .map((tutor) => String(tutor._id))
//     //   .filter((id) => activeTutorIds.includes(id));




// const assignedTutors = assignedResponse.data.tutors || [];

// const ids = assignedTutors
//   .map((tutor) => String(tutor._id))
//   .filter(Boolean);

// const dateMap = {};

// assignedTutors.forEach((tutor) => {
//   const id = String(tutor._id);

//   if (id) {
//     dateMap[id] = tutor.assignedAt || tutor.createdAt || null;
//   }
// });

// setAssignedTutorIds(ids);
// setAssignedTutorDates(dateMap);




//     const dateMap = {};

//     assignedTutors.forEach((tutor) => {
//       const id = String(tutor._id);

//       if (activeTutorIds.includes(id)) {
//         dateMap[id] = tutor.assignedAt || tutor.createdAt || null;
//       }
//     });

//     setAssignedTutorIds(ids);
//     setAssignedTutorDates(dateMap);
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to load assigned tutors"), "error");
//   } finally {
//     setAssignedViewLoading(false);
//   }
// }







async function openAssignedTutorsModal(student) {
  try {
    setAssignedViewStudent(student);
    setAssignedTutorIds([]);
    setAssignedTutorDates({});
    setAssignedViewSearch("");
    setAssignedViewOpen(true);
    setMenuOpenId(null);
    setAssignedViewLoading(true);

    const { data } = await api.get(
      `/admin/student/${getStudentId(student)}/assigned-tutors`
    );

    const assignedTutors = data.tutors || [];

    const ids = assignedTutors
      .map((tutor) => String(tutor._id))
      .filter(Boolean);

    const dateMap = {};

    assignedTutors.forEach((tutor) => {
      const id = String(tutor._id);

      if (id) {
        dateMap[id] = tutor.assignedAt || tutor.createdAt || null;
      }
    });

    setAssignedTutorIds(ids);
    setAssignedTutorDates(dateMap);
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to load assigned tutors"), "error");
  } finally {
    setAssignedViewLoading(false);
  }
}







useEffect(() => {
  if (tutorModalRestoreDoneRef.current) return;
  if (loading) return;
  if (!students.length) return;

  const rawRestoreData = sessionStorage.getItem(
    "adminStudentTutorModalRestore"
  );

  if (!rawRestoreData) return;

  let restoreData = null;

  try {
    restoreData = JSON.parse(rawRestoreData);
  } catch {
    sessionStorage.removeItem("adminStudentTutorModalRestore");
    return;
  }

  const restoreStudent = students.find(
    (student) => String(getStudentId(student)) === String(restoreData?.studentId)
  );

  if (!restoreStudent) return;

  tutorModalRestoreDoneRef.current = true;
  sessionStorage.removeItem("adminStudentTutorModalRestore");

  if (restoreData?.modalType === "assigned") {
    openAssignedTutorsModal(restoreStudent);
    return;
  }

  openAssignTutorModal(restoreStudent);
}, [loading, students.length]);






function askRemoveAssignedTutor(tutor) {
  setRemoveAssignedTutorTarget(tutor);
  setRemoveAssignedTutorOpen(true);
}



// async function removeAssignedTutorNow(tutorId) {
//   try {
//     if (!assignedViewStudent) return;

//     const cleanTutorId = String(tutorId);

//     const remainingTutorIds = assignedTutorIds
//       .map(String)
//       .filter((id) => id !== cleanTutorId);

//     setSubmitting(true);

//     await api.post(
//       `/admin/student/${getStudentId(assignedViewStudent)}/assign-tutors`,
//       {
//         tutorIds: remainingTutorIds,
//       }
//     );

//     setAssignedTutorIds(remainingTutorIds);

//     setAssignedTutorDates((prev) => {
//       const next = { ...prev };
//       delete next[cleanTutorId];
//       return next;
//     });

//     setStudentAssignedCounts((prev) => ({
//       ...prev,
//       [String(getStudentId(assignedViewStudent))]: remainingTutorIds.length,
//     }));

//     showAlert("Tutor unassigned successfully", "success");

//     fetchStudents();
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to unassign tutor"), "error");
//   } finally {
//     setSubmitting(false);
//   }
// }








async function removeAssignedTutorNow(tutorId) {
  try {
    if (!assignedViewStudent) return false;

    const cleanTutorId = String(tutorId);

    const remainingTutorIds = assignedTutorIds
      .map(String)
      .filter((id) => id !== cleanTutorId);

    setSubmitting(true);

    await api.post(
      `/admin/student/${getStudentId(assignedViewStudent)}/assign-tutors`,
      {
        tutorIds: remainingTutorIds,
      }
    );

    setAssignedTutorIds(remainingTutorIds);

    setAssignedTutorDates((prev) => {
      const next = { ...prev };
      delete next[cleanTutorId];
      return next;
    });

    setStudentAssignedCounts((prev) => ({
      ...prev,
      [String(getStudentId(assignedViewStudent))]: remainingTutorIds.length,
    }));

    showAlert("Tutor removed successfully", "success");

    fetchStudents();

    return true;
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to remove tutor"), "error");
    return false;
  } finally {
    setSubmitting(false);
  }
}








//   async function saveAssignedTutors() {
//     try {
//       if (!assignStudent) return;

//       setSubmitting(true);

//       // await api.post(`/admin/student/${getStudentId(assignStudent)}/assign-tutors`, {
//       //   tutorIds: assignedTutorIds,
//       // });






// const activeTutorIds = tutors
//   .filter((tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor))
//   .map((tutor) => String(tutor._id));

// const cleanTutorIds = assignedTutorIds
//   .map(String)
//   .filter((id) => activeTutorIds.includes(id));

// await api.post(`/admin/student/${getStudentId(assignStudent)}/assign-tutors`, {
//   tutorIds: cleanTutorIds,
// });






//       showAlert("Tutors assigned successfully", "success");
//       setAssignOpen(false);
//       setAssignStudent(null);
//       setAssignedTutorIds([]);
//     } catch (err) {
//       showAlert(getErrorMessage(err, "Failed to assign tutors"), "error");
//     } finally {
//       setSubmitting(false);
//     }
//   }




// async function saveAssignedTutors() {
//   try {
//     if (!assignStudent) return;

//     setSubmitting(true);

//     const activeTutorIds = tutors
//       .filter((tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor))
//       .map((tutor) => String(tutor._id));

//     const cleanTutorIds = assignedTutorIds
//       .map(String)
//       .filter((id) => activeTutorIds.includes(id));

//     await api.post(`/admin/student/${getStudentId(assignStudent)}/assign-tutors`, {
//       tutorIds: cleanTutorIds,
//     });

//     showAlert("Tutors assigned successfully", "success");
//     setAssignOpen(false);
//     setAssignStudent(null);
//     setAssignedTutorIds([]);
//     setAssignedTutorDates({});
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to assign tutors"), "error");
//   } finally {
//     setSubmitting(false);
//   }
// }











// async function saveAssignedTutors() {
//   try {
//     if (!assignStudent) return;

//     setSubmitting(true);

//     const activeTutorIds = tutors
//       .filter((tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor))
//       .map((tutor) => String(tutor._id));

//     const cleanTutorIds = assignedTutorIds
//       .map(String)
//       .filter((id) => activeTutorIds.includes(id));

//     await api.post(`/admin/student/${getStudentId(assignStudent)}/assign-tutors`, {
//       tutorIds: cleanTutorIds,
//     });

//     showAlert("Tutors assigned successfully", "success");

//     setAssignOpen(false);
//     setAssignStudent(null);
//     setAssignedTutorIds([]);
//     setAssignedTutorDates({});

//     fetchStudents();
//     fetchTutors();
//   } catch (err) {
//     showAlert(getErrorMessage(err, "Failed to assign tutors"), "error");
//   } finally {
//     setSubmitting(false);
//   }
// }









async function saveAssignedTutors() {
  try {
    if (!assignStudent) return;

    setSubmitting(true);










    // const activeTutorIds = tutors
    //   .filter((tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor))
    //   .map((tutor) => String(tutor._id));

    // const finalTutorIds = Array.from(
    //   new Set([
    //     ...assignedTutorIds.map(String),
    //     ...newAssignTutorIds.map(String),
    //   ])
    // ).filter((id) => activeTutorIds.includes(id));

    // await api.post(`/admin/student/${getStudentId(assignStudent)}/assign-tutors`, {
    //   tutorIds: finalTutorIds,
    // });









    const activeTutorIds = tutors
  .filter((tutor) => isTutorActive(tutor) && !isTutorBlocked(tutor))
  .map((tutor) => String(tutor._id));

const cleanNewTutorIds = newAssignTutorIds
  .map(String)
  .filter((id) => activeTutorIds.includes(id));

const finalTutorIds = Array.from(
  new Set([
    ...assignedTutorIds.map(String),
    ...cleanNewTutorIds,
  ])
);

await api.post(`/admin/student/${getStudentId(assignStudent)}/assign-tutors`, {
  tutorIds: finalTutorIds,
});








    showAlert("Tutors assigned successfully", "success");

    setStudentAssignedCounts((prev) => ({
      ...prev,
      [String(getStudentId(assignStudent))]: finalTutorIds.length,
    }));

    setAssignOpen(false);
    setAssignStudent(null);
    setAssignedTutorIds([]);
    setNewAssignTutorIds([]);
    setAssignedTutorDates({});

    fetchStudents();
    fetchTutors();
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to assign tutors"), "error");
  } finally {
    setSubmitting(false);
  }
}








  return (
    // <div className="student-page" onClick={() => setMenuOpenId(null)}>


<div
  className="student-page"
  onClick={() => {
    setMenuOpenId(null);
    setFilterOpen(false);
  }}
>

{/* 
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


 */}












<div className="student-toolbar" onClick={(e) => e.stopPropagation()}>
  <div className="student-search">
    <span>⌕</span>

    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search name, email, phone..."
    />
  </div>

  <div className="student-toolbar-actions">
    <div className="student-filter-wrap" ref={filterWrapRef}>
      <button
        type="button"
        className={`student-filter-btn ${
          filterOpen ? "student-filter-btn--active" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setFilterOpen((prev) => !prev);
          setMenuOpenId(null);
        }}
        aria-label="Filter students"
      >
        <StudentFilterIcon />
      </button>

      {filterOpen && (
        <div
          className="student-filter-menu"
          onClick={(e) => e.stopPropagation()}
        >
          {/* {studentFilterOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              className={
                studentFilter === option.key
                  ? "student-filter-option student-filter-option--active"
                  : "student-filter-option"
              }
              onClick={() => {
                setStudentFilter(option.key);
                setFilterOpen(false);
              }}
            >
              <span className="student-filter-check">
                {studentFilter === option.key ? "✓" : ""}
              </span>

              {option.label}
            </button>
          ))} */}





{/* {studentFilterOptions.map((option) => (
  <button
    key={option.key}
    type="button"
    className={studentFilter === option.key ? "active" : ""}
    onClick={() => {
      setStudentFilter(option.key);
      setFilterOpen(false);

      if (option.key === "new") {
        navigate("/admin/students?filter=new");
      } else {
        navigate("/admin/students");
      }
    }}
  >
    {studentFilter === option.key ? "✓" : ""}
    {option.label}
  </button>
))} */}









{studentFilterOptions.map((option) => (
  <button
    key={option.key}
    type="button"
    className={
      studentFilter === option.key
        ? "student-filter-option student-filter-option--active"
        : "student-filter-option"
    }
    onClick={() => {
      setStudentFilter(option.key);
      setFilterOpen(false);

      if (option.key === "new") {
        navigate("/admin/students?filter=new");
      } else {
        navigate("/admin/students");
      }
    }}
  >
    <span className="student-filter-check">
      {studentFilter === option.key ? "✓" : ""}
    </span>

    {option.label}
  </button>
))}







        </div>
      )}
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








{/* </div>

      {showOnlyNew && !loading && (
        <div className="student-new-filter-note">
          Showing students registered in the last 24 hours
        </div>
      )}

      {loading ? ( */}





      </div>

      <div className="student-list-heading">
        <h2>{studentFilterLabels[studentFilter]}</h2>
      </div>

      {/* {showOnlyNew && !loading && (
        <div className="student-new-filter-note">
          Showing students registered in the last 24 hours
        </div>
      )} */}

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
  className={getAssignedCount(student) === 0 ? "student-menu-disabled-btn" : ""}
  disabled={getAssignedCount(student) === 0}
  onClick={() => {
    if (getAssignedCount(student) === 0) return;
    openAssignedTutorsModal(student);
  }}
>
  <AssignedTutorsMenuIcon /> Assigned Tutors
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












                {/* <div className="student-card-actions">






                  <button
                    type="button"
                    className={`student-chat-btn ${isStudentBlocked(student) ? "student-chat-btn--disabled" : ""
                      }`}
                    disabled={isStudentBlocked(student)}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (isStudentBlocked(student)) {
                        showAlert("Blocked student chat is disabled", "error");
                        return;
                      }

                      openStudentChat(student);
                    }}
                  >
                    Chat
                  </button>






                  <button
                    type="button"
                    className="student-assign-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAssignTutorModal(student);
                    }}
                  >
                    Assign Tutors
                  </button>
                </div> */}







{!isStudentBlocked(student) && (
  <div className="student-card-actions">
    <button
      type="button"
      className="student-chat-btn"
      onClick={(e) => {
        e.stopPropagation();
        openStudentChat(student);
      }}
    >
      Chat
    </button>

    <button
      type="button"
      className="student-assign-btn"
      onClick={(e) => {
        e.stopPropagation();
        openAssignTutorModal(student);
      }}
    >
      Assign Tutors
    </button>
  </div>
)}








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
        // onClose={() => {
        //   setAssignOpen(false);
        //   setAssignStudent(null);
        //   setAssignedTutorIds([]);
        // }}




onClose={() => {
  setAssignOpen(false);
  setAssignStudent(null);
  setAssignedTutorIds([]);
  setNewAssignTutorIds([]);
  setAssignedTutorDates({});
}}




      >
        {/* <div className="assign-tutor-box assign-tutor-box-dark"> */}
        <div className="assign-tutor-box assign-tutor-box-dark assign-tutor-box--assigned-view">
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
            // <div className="assign-tutor-state assign-tutor-state-dark">
            //   No tutors found
            // </div>



<div className="assign-tutor-state assign-tutor-state-dark">
  No tutors found
</div>




          ) : (
            <div className="assign-tutor-list assign-tutor-list-dark">
              {/* {filteredAssignTutors.map((tutor) => {
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
              })} */}




{/* {filteredAssignTutors.map((tutor) => {
  const tutorId = String(tutor._id);
  const checked = assignedTutorIds.map(String).includes(tutorId);
  const photo = tutor.photo ? getMediaUrl(tutor.photo) : "";
  const assignedDateText = checked
    ? formatAssignedDate(assignedTutorDates[tutorId])
    : "";

  return (
    <label
      key={tutor._id}
      className={`assign-tutor-item assign-tutor-item-dark ${
        checked ? "assign-tutor-item--selected" : ""
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

      {assignedDateText && (
        <div className="assign-tutor-date">
          <span>Assigned</span>
          <b>{assignedDateText}</b>
        </div>
      )}
    </label>
  );
})} */}










{/* {filteredAssignTutors.map((tutor) => {
  const tutorId = String(tutor._id);
  const checked = assignedTutorIds.map(String).includes(tutorId);
  const photo = tutor.photo ? getMediaUrl(tutor.photo) : "";

  const assignedDateText = checked
    ? formatAssignedDate(assignedTutorDates[tutorId])
    : "";

  return (
    <label
      key={tutor._id}
      className={`assign-tutor-item assign-tutor-item-dark ${
        checked ? "assign-tutor-item--selected" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => toggleAssignedTutor(tutor._id, e.target.checked)}
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
        <small>{tutor.email || tutor.phone || "No contact added"}</small>
      </div>

      {assignedDateText && (
        <div className="assign-tutor-date">
          <span>Assigned</span>
          <b>{assignedDateText}</b>
        </div>
      )}
    </label>
  );
})} */}






{/* 


{filteredAssignTutors.map((tutor) => {
  const tutorId = String(tutor._id);
  const checked = newAssignTutorIds.map(String).includes(tutorId);
  const photo = tutor.photo ? getMediaUrl(tutor.photo) : "";

  return (
    // <label
    //   key={tutor._id}
    //   className={`assign-tutor-item assign-tutor-item-dark ${
    //     checked ? "assign-tutor-item--selected" : ""
    //   }`}
    // >
    //   <input
    //     type="checkbox"
    //     checked={checked}
    //     onChange={(e) => toggleNewAssignTutor(tutor._id, e.target.checked)}
    //   />

    //   <div className="assign-tutor-avatar">
    //     {photo ? (
    //       <img src={photo} alt={tutor.name || "Tutor"} />
    //     ) : (
    //       <span>{tutor.name?.charAt(0)?.toUpperCase() || "T"}</span>
    //     )}
    //   </div>

    //   <div className="assign-tutor-info assign-tutor-info-dark">
    //     <h4>{tutor.name || "Tutor"}</h4>
    //     <p>{tutor.qualification || "Qualification not added"}</p>
    //     <small>{tutor.email || tutor.phone || "No contact added"}</small>
    //   </div>
    // </label>




<label
  key={tutor._id}
  className={`assign-tutor-item assign-tutor-item-dark ${
    newAssignTutorIds.map(String).includes(String(tutor._id))
      ? "assign-tutor-item--selected"
      : ""
  }`}
>
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
    <small>{tutor.email || tutor.phone || "No contact added"}</small>
  </div>

  <button
    type="button"
    className="assign-tutor-eye-btn"
    title="View tutor details"
    aria-label="View tutor details"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      goToTutorDetailsFromStudentModal(tutor, "assign", assignStudent);
    }}
  >
    <FiEye />
  </button>

  <input
    type="checkbox"
    checked={newAssignTutorIds.map(String).includes(String(tutor._id))}
    disabled={submitting}
    onChange={(e) => {
      toggleNewAssignTutor(tutor._id, e.target.checked);
    }}
  />
</label>




  );
})} */}





{filteredAssignTutors.map((tutor) => {
  const photo = getStudentPhoto(tutor.photo);
  const checked = newAssignTutorIds.map(String).includes(String(tutor._id));

  return (
    <div
      key={tutor._id}
      className={`assign-tutor-item assign-tutor-item-dark ${
        checked ? "assign-tutor-item--selected" : ""
      }`}
    >
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
        <small>{tutor.email || tutor.phone || "No contact added"}</small>
      </div>

      {/* <button
        type="button"
        className="assign-tutor-eye-btn"
        title="View tutor details"
        aria-label="View tutor details"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goToTutorDetailsFromStudentModal(tutor, "assign", assignStudent);
        }}
      >
        <FiEye />
      </button> */}





<button
  type="button"
  className="assign-tutor-eye-btn"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    goToTutorDetailsFromStudentModal(tutor, "assign", assignStudent);
  }}
  aria-label="View tutor details"
>
  <FiEye />
</button>





      <input
        type="checkbox"
        checked={checked}
        disabled={submitting}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={(e) => {
          toggleNewAssignTutor(tutor._id, e.target.checked);
        }}
      />
    </div>
  );
})}






            </div>
          )}

          <div className="assign-tutor-actions">
            {/* <button
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
            </button> */}






<button
  type="button"
  className="secondary-btn"
  // onClick={() => {
  //   setAssignOpen(false);
  //   setAssignStudent(null);
  //   setAssignedTutorIds([]);
  //   setAssignedTutorDates({});
  // }}


onClick={() => {
  setAssignOpen(false);
  setAssignStudent(null);
  setAssignedTutorIds([]);
  setNewAssignTutorIds([]);
  setAssignedTutorDates({});
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



<StudentDarkModal
  open={assignedViewOpen}
  title={`Assigned Tutors${
    assignedViewStudent?.name ? ` - ${assignedViewStudent.name}` : ""
  }`}
  width="760px"
  onClose={() => {
    setAssignedViewOpen(false);
    setAssignedViewStudent(null);
    setAssignedTutorIds([]);
    setAssignedTutorDates({});
    setAssignedViewSearch("");
  }}
>
  <div className="assign-tutor-box assign-tutor-box-dark assigned-tutor-view-box">
    <div className="assign-tutor-search assign-tutor-search-dark">
      <span>⌕</span>

      <input
        value={assignedViewSearch}
        onChange={(e) => setAssignedViewSearch(e.target.value)}
        placeholder="Search assigned tutors..."
      />
    </div>

    {assignedViewLoading ? (
      <div className="assign-tutor-state assign-tutor-state-dark">
        Loading assigned tutors...
      </div>
    ) : filteredAssignedViewTutors.length === 0 ? (
      <div className="assign-tutor-state assign-tutor-state-dark">
        No assigned tutors found
      </div>
    ) : (
      <div className="assign-tutor-list assign-tutor-list-dark">









{filteredAssignedViewTutors.map((tutor) => {
  const photo = getStudentPhoto(tutor.photo);
  const assignedDateText = formatAssignedDate(
    assignedTutorDates[String(tutor._id)]
  );

  return (
    <div
      key={tutor._id}
      className="assign-tutor-item assign-tutor-item-dark assign-tutor-item--selected"
    >
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
        <small>{tutor.email || tutor.phone || "No contact added"}</small>
      </div>

      {/* <button
        type="button"
        className="assign-tutor-eye-btn"
        title="View tutor details"
        aria-label="View tutor details"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          goToTutorDetailsFromStudentModal(
            tutor,
            "assigned",
            assignedViewStudent
          );
        }}
      >
        <FiEye />
      </button> */}




<button
  type="button"
  className="assign-tutor-eye-btn"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    goToTutorDetailsFromStudentModal(tutor, "assigned", assignedViewStudent);
  }}
  aria-label="View tutor details"
>
  <FiEye />
</button>





      <input
        type="checkbox"
        checked={true}
        disabled={submitting}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          askRemoveAssignedTutor(tutor);
        }}
        onChange={() => {}}
      />

      {assignedDateText && (
        <div className="assign-tutor-date">
          <span>Assigned</span>
          <b>{assignedDateText}</b>
        </div>
      )}
    </div>
  );
})}





        
      </div>
    )}
  </div>
</StudentDarkModal>







<StudentDarkModal
  open={removeAssignedTutorOpen}
  title="Remove Assigned Tutor"
  width="560px"
  onClose={() => {
    if (submitting) return;
    setRemoveAssignedTutorOpen(false);
    setRemoveAssignedTutorTarget(null);
  }}
>
  <div className="student-remove-assigned-confirm">
    <p>
      Do you want to remove{" "}
      <b>{removeAssignedTutorTarget?.name || "this tutor"}</b> from this student?
    </p>

    <div className="student-remove-assigned-actions">
      <button
        type="button"
        className="secondary-btn"
        disabled={submitting}
        onClick={() => {
          setRemoveAssignedTutorOpen(false);
          setRemoveAssignedTutorTarget(null);
        }}
      >
        Cancel
      </button>

      <button
        type="button"
        className="danger-btn student-remove-assigned-remove-btn"
        disabled={submitting}
        onClick={async () => {
          if (!removeAssignedTutorTarget) return;

          const removed = await removeAssignedTutorNow(
            removeAssignedTutorTarget._id
          );

          if (removed) {
            setRemoveAssignedTutorOpen(false);
            setRemoveAssignedTutorTarget(null);
          }
        }}
      >
        {submitting ? "Removing..." : "Remove"}
      </button>
    </div>
  </div>
</StudentDarkModal>








    </div>
  );
}