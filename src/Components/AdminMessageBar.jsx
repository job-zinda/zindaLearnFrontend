

export default function AdminMessageBar({ pageMsg, pageError }) {
  return (
    <>
      {pageMsg ? <div className="admin-message success">{pageMsg}</div> : null}
      {pageError ? <div className="admin-message error">{pageError}</div> : null}
    </>
  );
}