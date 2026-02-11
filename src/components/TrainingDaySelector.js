"use client";

import { useState } from "react";

export default function TrainingDaySelector({ currentDays }) {
  const [days, setDays] = useState(currentDays);
  const [saving, setSaving] = useState(false);

  const handleChange = async (newDays) => {
    if (newDays < 3 || newDays > 7 || newDays === days) return;

    setDays(newDays);
    setSaving(true);

    try {
      const res = await fetch("/api/user/training-days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainingDays: newDays }),
      });

      if (!res.ok) throw new Error("Failed to update");

      // Reload to show updated workouts
      window.location.reload();
    } catch (e) {
      console.error("Error updating training days:", e);
      setDays(currentDays); // Revert on error
      setSaving(false);
    }
  };

  return (
    <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-300">Training Days per Week</p>
          <p className="text-xs text-zinc-500">Adjust to regenerate your workout plan</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleChange(days - 1)}
            disabled={days <= 3 || saving}
            className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            -
          </button>
          <span className="text-xl font-bold text-orange-500 w-6 text-center">
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              days
            )}
          </span>
          <button
            onClick={() => handleChange(days + 1)}
            disabled={days >= 7 || saving}
            className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
