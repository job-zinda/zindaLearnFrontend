
import AdminModal from "./AdminModal";

export default function EditSubsectionModal({
  open,
  form,
  setForm,
  loading,
  onClose,
  onSubmit,
}) {
  return (
    <AdminModal
      open={open}
      title="Edit Subsection"
      onClose={onClose}
      width="620px"
    >
      <form className="admin-form" onSubmit={onSubmit}>
        <label>Select section</label>
        <select
          value={form.sectionType}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              sectionType: e.target.value,
            }))
          }
        >
          <option value="one_to_one">one - one section</option> z
          <option value="batch">batch section</option>
        </select>

        <label>Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          required
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