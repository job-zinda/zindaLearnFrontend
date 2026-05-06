

import React from "react";
import { useAlert } from "../context/AlertContext";

export default function InlineAlert() {
  const { alert, clearAlert } = useAlert();

  if (!alert) return null;

  return (
    <div className={`inline-alert inline-alert--${alert.type}`}>
      <div className="inline-alert__content">
        <span>{alert.message}</span>
        <button
          type="button"
          className="inline-alert__close"
          onClick={clearAlert}
        >
          ×
        </button>
      </div>
    </div>
  );
}