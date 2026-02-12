"use client";

import { useState } from "react";

export default function CustomizationPanel({ children }) {
  const [visible, setVisible] = useState(true);

  return (
    <div id="customization-panel" className="mt-12">
      <button
        onClick={() => setVisible(!visible)}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-colors mb-6"
      >
        <svg
          className={`w-4 h-4 transition-transform ${visible ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {visible ? "Hide Customization Settings" : "Show Customization Settings"}
      </button>
      {visible && <div>{children}</div>}
    </div>
  );
}
