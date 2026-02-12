"use client";

import { useState } from "react";

const LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Lighter weights, more guidance",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Moderate intensity, balanced",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Heavier loads, higher volume",
  },
];

export default function IntensitySelector({ currentLevel, racePlanActive }) {
  const [level, setLevel] = useState(currentLevel);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  const handleSelect = async (newLevel) => {
    if (newLevel === level || saving || status) return;

    setLevel(newLevel);
    setSaving(true);
    setError(null);
    setStatus("Updating intensity...");

    try {
      const res = await fetch("/api/user/intensity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience: newLevel }),
      });

      if (!res.ok) {
        const text = await res.text();
        let msg;
        try { msg = JSON.parse(text).error; } catch { msg = text; }
        throw new Error(msg || `Server error ${res.status}`);
      }

      const data = await res.json();

      if (data.racePlanRegenerating) {
        setStatus("Regenerating this week's race workouts...");
        setSaving(false);

        const regenRes = await fetch("/api/user/regen-current-week", { method: "POST" });
        if (!regenRes.ok) {
          const text = await regenRes.text();
          let msg;
          try { msg = JSON.parse(text).error; } catch { msg = text; }
          throw new Error(msg || "Failed to regenerate race workouts");
        }
      }

      setStatus(null);
      window.location.href = window.location.href;
    } catch (e) {
      setError(e.message);
      setStatus(null);
      setLevel(currentLevel);
      setSaving(false);
    }
  };

  const busy = saving || !!status;

  return (
    <div className="border-t border-zinc-800/50 mt-8 pt-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-zinc-200">
          First week too easy or too hard?
        </h3>
        <p className="text-sm text-zinc-500 mt-1">
          Adjust your experience level to change workout intensity.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {status && (
        <div className="mb-4 rounded-lg bg-orange-500/10 border border-orange-500/30 p-3 flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-sm text-orange-400">{status}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            onClick={() => handleSelect(l.value)}
            disabled={busy}
            className={`rounded-lg px-4 py-3 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              level === l.value
                ? "bg-orange-500 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
            }`}
          >
            <span className="text-sm font-medium block">{l.label}</span>
            <span className={`text-xs block mt-0.5 ${level === l.value ? "text-orange-100" : "text-zinc-500"}`}>
              {l.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
