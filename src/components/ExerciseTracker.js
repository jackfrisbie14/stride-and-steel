"use client";

import { useState, useEffect } from "react";

function SetRow({ setIndex, weight, reps, completed, onChange }) {
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="w-8 text-xs text-zinc-500 font-medium">Set {setIndex + 1}</span>
      <div className="flex-1 flex items-center gap-2">
        <input
          type="number"
          placeholder="lbs"
          value={weight || ""}
          onChange={(e) => onChange({ weight: e.target.value, reps, completed })}
          className="w-16 px-2 py-1.5 text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
        />
        <span className="text-zinc-500 text-xs">×</span>
        <input
          type="number"
          placeholder="reps"
          value={reps || ""}
          onChange={(e) => onChange({ weight, reps: e.target.value, completed })}
          className="w-16 px-2 py-1.5 text-sm rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
        />
      </div>
      <button
        type="button"
        onClick={() => onChange({ weight, reps, completed: !completed })}
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
          completed
            ? "bg-green-500 text-white"
            : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  );
}

function ExerciseSection({ exercise, exerciseLog, onChange }) {
  const numSets = exercise.sets || 3;
  const sets = exerciseLog?.sets || Array(numSets).fill({ weight: "", reps: "", completed: false });

  const handleSetChange = (setIndex, data) => {
    const newSets = [...sets];
    newSets[setIndex] = data;
    onChange({ exerciseName: exercise.name, sets: newSets });
  };

  const completedSets = sets.filter(s => s.completed).length;
  const isComplete = completedSets === numSets;

  return (
    <div className={`rounded-xl border p-4 transition-colors ${
      isComplete ? "border-green-500/30 bg-green-500/5" : "border-zinc-800 bg-zinc-900/50"
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-medium text-white">{exercise.name}</h4>
          <p className="text-xs text-zinc-500">
            {exercise.sets} × {exercise.reps} • Rest: {exercise.rest}
          </p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          isComplete
            ? "bg-green-500/20 text-green-400"
            : "bg-zinc-800 text-zinc-400"
        }`}>
          {completedSets}/{numSets}
        </span>
      </div>
      <div className="space-y-1">
        {Array(numSets).fill(null).map((_, i) => (
          <SetRow
            key={i}
            setIndex={i}
            weight={sets[i]?.weight}
            reps={sets[i]?.reps}
            completed={sets[i]?.completed}
            onChange={(data) => handleSetChange(i, data)}
          />
        ))}
      </div>
    </div>
  );
}

export default function ExerciseTracker({ exercises, exerciseLogs, onSave }) {
  const [logs, setLogs] = useState(exerciseLogs || []);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (exerciseLogs) {
      setLogs(exerciseLogs);
    }
  }, [exerciseLogs]);

  const handleExerciseChange = (exerciseLog) => {
    const newLogs = [...logs];
    const existingIndex = newLogs.findIndex(l => l.exerciseName === exerciseLog.exerciseName);
    if (existingIndex >= 0) {
      newLogs[existingIndex] = exerciseLog;
    } else {
      newLogs.push(exerciseLog);
    }
    setLogs(newLogs);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(logs);
    } finally {
      setIsSaving(false);
    }
  };

  // Only show exercises that have sets (weight exercises)
  const weightExercises = exercises.filter(ex => ex.sets && ex.reps);

  // Calculate overall progress
  const totalSets = weightExercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
  const completedSets = logs.reduce((sum, log) => {
    return sum + (log.sets?.filter(s => s.completed)?.length || 0);
  }, 0);
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  if (weightExercises.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Track Your Sets</h3>
        <span className="text-sm text-zinc-400">{completedSets}/{totalSets} sets</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-green-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Exercise Sections */}
      <div className="space-y-3">
        {weightExercises.map((exercise, index) => (
          <ExerciseSection
            key={index}
            exercise={exercise}
            exerciseLog={logs.find(l => l.exerciseName === exercise.name)}
            onChange={handleExerciseChange}
          />
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3 rounded-xl bg-blue-500 font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Progress"}
      </button>
    </div>
  );
}
