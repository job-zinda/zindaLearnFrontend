
import AdminModal from "./AdminModal";

export default function EditClassModal({
  open,
  form,
  setForm,
  loading,
  onClose,
  onSubmit,
}) {
  return (
    <AdminModal open={open} title="Edit Class" onClose={onClose}>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>Add image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              image: e.target.files?.[0] || null,
              preview: e.target.files?.[0]
                ? URL.createObjectURL(e.target.files[0])
                : prev.preview,
            }))
          }
        />

        {form.preview ? (
          <div className="admin-preview-box">
            <img src={form.preview} alt="preview" />
          </div>
        ) : null}

        <label>Classname</label>
        <input
          type="text"
          value={form.className}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              className: e.target.value,
            }))
          }
          required
        />

        <label>Discription</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />

        <div className="admin-form-actions">
          <button type="button" className="secondary" onClick={onClose}>
            Back
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}