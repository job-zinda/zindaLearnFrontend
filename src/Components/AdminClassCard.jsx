

export default function AdminClassCard({
  item,
  colorClass,
  buildImageUrl,
  onEdit,
  onDelete,
}) {
  return (
    <div className="admin-class-card" tabIndex={0}>
      <div className="admin-card-actions">
        <button
          type="button"
          className="icon-action"
          title="Edit class box"
          onClick={onEdit}
        >
          ✎
        </button>
        <button
          type="button"
          className="icon-action delete"
          title="Delete class box"
          onClick={onDelete}
        >
          🗑
        </button>
      </div>

      <div className={`admin-class-icon ${colorClass}`}>
        {item.image ? (
          <img src={buildImageUrl(item.image)} alt={item.className} />
        ) : (
          <span>📖</span>
        )}
      </div>

      <h3>{item.className}</h3>
      <p>{item.description || "No description added"}</p>
    </div>
  );
}