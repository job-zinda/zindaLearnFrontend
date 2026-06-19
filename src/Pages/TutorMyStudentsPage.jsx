import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import "./TutorMyStudentsPage.css";

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

function getStudentId(student) {
  return student?._id || student?.id;
}

function StudentCard({ student, onChat }) {
  const photoSrc = getImageSrc(student?.photo);

  return (
    <article className="tutor-my-student-card">
      <div className="tutor-my-student-avatar">
        {photoSrc ? (
          <img src={photoSrc} alt={student?.name || "Student"} />
        ) : (
          <span>{student?.name?.charAt(0)?.toUpperCase() || "S"}</span>
        )}
      </div>

      <h3>{student?.name || "Student"}</h3>

      <div className="tutor-my-student-details">
        <p>
          <b>Email:</b> {student?.email || "Not added"}
        </p>
        <p>
          <b>Phone:</b> {student?.phone || "Not added"}
        </p>
      </div>

      <button
        type="button"
        className="tutor-my-student-chat-btn"
        onClick={() => onChat(student)}
      >
        Chat
      </button>
    </article>
  );
}

export default function TutorMyStudentsPage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchStudents() {
    try {
      setLoading(true);

      const { data } = await api.get("/tutor/my-assigned-students");

      setStudents(data?.students || []);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load my students"), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return students;

    return students.filter((student) =>
      [student.name, student.email, student.phone]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [students, search]);

  async function openStudentChat(student) {
    try {
      const studentId = getStudentId(student);

      if (!studentId) {
        showAlert("Student id not found", "error");
        return;
      }

      const { data } = await api.post(`/chat/tutor-student-room/${studentId}`);

      const roomId = data?.room?._id || data?.chatRoom?._id || data?.roomId;

      if (roomId) {
        navigate(`/tutor/chats?roomId=${roomId}&open=chat`);
      } else {
        navigate("/tutor/chats");
      }
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to open student chat"), "error");
    }
  }

  return (
    <div className="tutor-my-students-page">
      <div className="tutor-my-students-toolbar">
        <div className="tutor-my-students-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
          />
        </div>
      </div>

      {loading ? (
        <div className="tutor-my-students-state">Loading students...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="tutor-my-students-state">No assigned students found</div>
      ) : (
        <div className="tutor-my-students-grid">
          {filteredStudents.map((student) => (
            <StudentCard
              key={getStudentId(student)}
              student={student}
              onChat={openStudentChat}
            />
          ))}
        </div>
      )}
    </div>
  );
}