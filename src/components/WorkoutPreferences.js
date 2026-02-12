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

export default function WorkoutPreferences({ split, onSplitChange, exercises, onExercisesChange, disabled }) {
  const [inputValue, setInputValue] = useState("");

  const handleAddExercise = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (exercises.length >= 10) return;
    if (exercises.some(e => e.toLowerCase() === trimmed.toLowerCase())) return;
    onExercisesChange([...exercises, trimmed]);
    setInputValue("");
  };

  const handleRemoveExercise = (index) => {
    onExercisesChange(exercises.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddExercise();
    }
  };

  return (
    <>
      {/* Lifting Split Selection */}
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-300 mb-3">Lifting Split</p>
        <div className="flex flex-wrap gap-2">
          {SPLITS.map((s) => (
            <button
              key={s.value}
              onClick={() => onSplitChange(split === s.value ? null : s.value)}
              disabled={disabled}
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
            disabled={disabled || exercises.length >= 10}
            className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleAddExercise}
            disabled={disabled || !inputValue.trim() || exercises.length >= 10}
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
                  disabled={disabled}
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
    </>
  );
}
