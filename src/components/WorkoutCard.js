"use client";

import { useState } from "react";
import Link from "next/link";
import ExerciseModal from "./ExerciseModal";
import { getExercise } from "@/lib/exercises";

const typeColors = {
  Lift: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Run: "bg-green-500/20 text-green-400 border-green-500/30",
  Recovery: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const typeIcons = {
  Lift: "🏋️",
  Run: "🏃",
  Recovery: "🧘",
};

export default function WorkoutCard({ workout, locked = false }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedExerciseName, setSelectedExerciseName] = useState("");

  const handleExerciseClick = (exerciseName) => {
    const exerciseData = getExercise(exerciseName);
    setSelectedExercise(exerciseData);
    setSelectedExerciseName(exerciseName);
  };

  const closeModal = () => {
    setSelectedExercise(null);
    setSelectedExerciseName("");
  };

  if (locked) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden opacity-60">
        <div className="w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{typeIcons[workout.type]}</span>
            <div>
              <p className="text-sm text-zinc-500">{workout.day}</p>
              <h3 className="font-semibold">{workout.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[workout.type]}`}
            >
              {workout.type}
            </span>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Unlock
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{typeIcons[workout.type]}</span>
            <div>
              <p className="text-sm text-zinc-500">{workout.day}</p>
              <h3 className="font-semibold">{workout.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[workout.type]}`}
            >
              {workout.type}
            </span>
            <svg
              className={`w-5 h-5 text-zinc-500 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {expanded && (
          <div className="border-t border-zinc-800 p-4">
            <table className="w-full">
              <tbody>
                {workout.exercises.map((exercise, index) => (
                  <tr key={index} className="border-b border-zinc-800 last:border-0">
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => handleExerciseClick(exercise.name)}
                        className="text-left group"
                      >
                        <p className="font-medium group-hover:text-orange-400 transition-colors flex items-center gap-2">
                          {exercise.name}
                          <svg
                            className="w-4 h-4 text-zinc-600 group-hover:text-orange-400 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </p>
                        {exercise.notes && (
                          <p className="text-sm text-zinc-500 mt-1">{exercise.notes}</p>
                        )}
                      </button>
                    </td>
                    <td className="py-3 text-right text-zinc-400">
                      {exercise.sets && exercise.reps && (
                        <span>{exercise.sets} × {exercise.reps}</span>
                      )}
                      {exercise.duration && <span>{exercise.duration}</span>}
                      {exercise.pace && (
                        <span className="block text-sm text-zinc-500">{exercise.pace}</span>
                      )}
                      {exercise.rest && (
                        <span className="block text-sm text-zinc-500">Rest: {exercise.rest}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Exercise Modal */}
      {selectedExerciseName && (
        <ExerciseModal
          exercise={selectedExercise}
          exerciseName={selectedExerciseName}
          onClose={closeModal}
        />
      )}
    </>
  );
}
