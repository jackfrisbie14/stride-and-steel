"use client";

import { useState, useEffect } from "react";

export default function TrainingDaySelector({ currentDays }) {
  const [days, setDays] = useState(currentDays);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!saving && !status) {
      setDays(currentDays);
    }
  }, [currentDays, saving, status]);

  const handleChange = async (newDays) => {
    if (newDays < 3 || newDays > 7 || newDays === days) return;

    setDays(newDays);
    setSaving(true);
    setError(null);
    setStatus("Updating training days...");

    try {
      // Step 1: Update training days + quiz workouts (fast)
      const res = await fetch("/api/user/training-days", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainingDays: newDays }),
      });

      if (!res.ok) {
        const text = await res.text();
        let msg;
        try { msg = JSON.parse(text).error; } catch { msg = text; }
        throw new Error(msg || `Server error ${res.status}`);
      }

      const data = await res.json();

      // Step 2: If race plan active, regenerate current week only
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
      setDays(currentDays);
      setSaving(false);
    }
  };

  const busy = saving || !!status;

  return (
    <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      {error && (
        <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/30 p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {status && (
        <div className="mb-3 rounded-lg bg-orange-500/10 border border-orange-500/30 p-3 flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-sm text-orange-400">{status}</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-300">Training Days per Week</p>
          <p className="text-xs text-zinc-500">Adjust to regenerate your workout plan</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleChange(days - 1)}
            disabled={days <= 3 || busy}
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
            disabled={days >= 7 || busy}
            className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
