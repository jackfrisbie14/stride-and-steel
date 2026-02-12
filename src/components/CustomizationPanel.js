"use client";

import { useState } from "react";

export default function CustomizationPanel({ children }) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="mt-12">
      <button
        onClick={() => setVisible(!visible)}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4"
      >
        <svg
          className={`w-4 h-4 transition-transform ${visible ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {visible ? "Hide" : "Show"} customization settings
      </button>
      {visible && <div>{children}</div>}
    </div>
  );
}
