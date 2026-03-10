import React from "react";

export default function ConfirmModal({ open, title, message, onCancel, onConfirm, loading }) {
  if (!open) return null;
  return (
    <div className="overlay">
      <div className="modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn btn-warning" onClick={onConfirm} disabled={loading}>
            {loading ? <><span className="loader" /> Deleting...</> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
