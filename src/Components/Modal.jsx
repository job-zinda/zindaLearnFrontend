
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  open,
  title,
  onClose,
  children,
  width = "720px",
}) {
  const bodyRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        if (bodyRef.current) {
          bodyRef.current.scrollTop = 0;
        }
      }, 0);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-card__header">
          <h3>{title}</h3>
          <button
            type="button"
            className="modal-card__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-card__body" ref={bodyRef}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}