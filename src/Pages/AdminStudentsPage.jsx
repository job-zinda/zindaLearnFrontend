


import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
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

function resizeImageToBase64(file, maxSize = 420, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");

        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.onerror = () => reject(new Error("Image load failed"));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

export default function AdminStudentsPage() {
  const { showAlert } = useAlert();
  const location = useLocation();
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

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    });
    setPreview(getStudentPhoto(student.photo));
    setEditOpen(true);
    setMenuOpenId(null);
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      if (file.size > 5 * 1024 * 1024) {
        showAlert("Image size 5MB-il താഴെ ആയിരിക്കണം", "error");
        return;
      }

      const compressedBase64 = await resizeImageToBase64(file, 420, 0.72);

      setEditForm((prev) => ({
        ...prev,
        photo: compressedBase64,
      }));

      setPreview(compressedBase64);
    } catch (err) {
      showAlert(err.message || "Photo select cheyyan kazhinjilla", "error");
    }
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

      await api.put(`/admin/student/update/${getStudentId(editingStudent)}`, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        photo: editForm.photo || "",
      });

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
        >
          + Invite Student
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
                className={`student-card ${
                  newStudent ? "student-card--new" : ""
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {newStudent && (
                  <span className="student-new-badge">New 24h</span>
                )}

                <div className="student-menu-wrap">
                  <button
                    type="button"
                    className="student-menu-btn"
                    onClick={() =>
                      setMenuOpenId(menuOpenId === studentId ? null : studentId)
                    }
                  >
                    ⋮
                  </button>

                  {menuOpenId === studentId && (
                    <div className="student-menu">
                      <button
                        type="button"
                        onClick={() => openEditModal(student)}
                      >
                        ✎ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => askDeleteStudent(student)}
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
              </article>
            );
          })}
        </div>
      )}

      <Modal
        open={inviteOpen}
        title="Invite Student"
        width="560px"
        onClose={() => setInviteOpen(false)}
      >
        <form className="student-form" onSubmit={sendInvite}>
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
      </Modal>

      <Modal
        open={editOpen}
        title="Edit Student"
        width="620px"
        onClose={() => setEditOpen(false)}
      >
        <form className="student-form" onSubmit={updateStudent}>
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
      </Modal>

      <Modal
        open={deleteOpen}
        title="Delete Student Account"
        width="440px"
        onClose={() => setDeleteOpen(false)}
      >
        <div className="student-delete-box">
          <p>
            <b>{deleteTarget?.name || "This student"}</b> delete account?
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
      </Modal>
    </div>
  );
}