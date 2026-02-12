"use client";

import { useState } from "react";

const SPLITS = [
  {
    value: "ppl",
    label: "Push / Pull / Legs",
    description: "Chest+Shoulders+Tri, Back+Bi, Legs",
  },
  {
    value: "arnold",
    label: "Arnold Split",
    description: "Chest+Back, Shoulders+Arms, Legs",
  },
  {
    value: "upper_lower",
    label: "Upper / Lower",
    description: "Alternate upper and lower body days",
  },
  {
    value: "bro_split",
    label: "Bro Split",
    description: "Dedicate each day to one muscle group",
  },
  {
    value: "full_body",
    label: "Full Body",
    description: "Hit everything each session",
  },
];

export default function WorkoutPreferences({ currentSplit, currentExercises, racePlanActive }) {
  const [split, setSplit] = useState(currentSplit || null);
  const [exercises, setExercises] = useState(currentExercises || []);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  const hasChanges =
    split !== (currentSplit || null) ||
    JSON.stringify(exercises) !== JSON.stringify(currentExercises || []);

  const handleAddExercise = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (exercises.length >= 10) return;
    if (exercises.some(e => e.toLowerCase() === trimmed.toLowerCase())) return;
    setExercises([...exercises, trimmed]);
    setInputValue("");
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddExercise();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setStatus("Saving preferences...");

    try {
      const res = await fetch("/api/user/workout-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          liftingSplit: split,
          customExercises: exercises.length > 0 ? exercises : null,
        }),
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
      setSaving(false);
    }
  };

  const busy = saving || !!status;

  return (
    <div className="border-t border-zinc-800/50 mt-12 pt-8">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-zinc-200">
          Not happy with the workouts generated?
        </h3>
        <p className="text-sm text-zinc-500 mt-1">
          Choose a lifting split or add your favorite exercises to personalize your plan.
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

      {/* Lifting Split Selection */}
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-300 mb-3">Lifting Split</p>
        <div className="flex flex-wrap gap-2">
          {SPLITS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSplit(split === s.value ? null : s.value)}
              disabled={busy}
              className={`rounded-lg px-3 py-2 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                split === s.value
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300"
              }`}
            >
              <span className="text-sm font-medium block">{s.label}</span>
              <span className={`text-xs block mt-0.5 ${split === s.value ? "text-orange-100" : "text-zinc-500"}`}>
                {s.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Exercises */}
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-300 mb-3">
          Favorite Exercises
          <span className="text-zinc-500 font-normal ml-2">({exercises.length}/10)</span>
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Deadlift, Hip Thrust..."
            disabled={busy || exercises.length >= 10}
            className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleAddExercise}
            disabled={busy || !inputValue.trim() || exercises.length >= 10}
            className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        {exercises.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {exercises.map((exercise, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1 text-sm text-zinc-300"
              >
                {exercise}
                <button
                  onClick={() => handleRemoveExercise(index)}
                  disabled={busy}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors disabled:cursor-not-allowed"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={busy || !hasChanges}
        className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {busy ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Regenerating...
          </span>
        ) : (
          "Save & Regenerate Workouts"
        )}
      </button>
    </div>
  );
}
