export default function AdminDeleteBar({
  pendingDelete,
  onConfirm,
  onCancel,
}) {
  if (!pendingDelete) return null;

  return (
    <div className="admin-inline-confirm">
      <span>{pendingDelete.message}</span>
      <div className="admin-inline-confirm-actions">
        <button type="button" className="danger" onClick={onConfirm}>
          Delete
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}