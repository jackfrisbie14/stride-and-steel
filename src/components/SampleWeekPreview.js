"use client";

import { useState } from "react";

const SAMPLE_WORKOUTS = [
  {
    day: "Monday",
    type: "Lift",
    title: "Upper Body Push",
    icon: "🏋️",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    duration: "50 min",
    exercises: [
      { name: "Barbell Bench Press", detail: "4 x 8", notes: "Flat bench, controlled tempo" },
      { name: "Overhead Press", detail: "3 x 10", notes: "Standing, strict form" },
      { name: "Incline Dumbbell Press", detail: "3 x 10", notes: "30-degree incline" },
      { name: "Lateral Raises", detail: "3 x 15", notes: "Light weight, slow negative" },
      { name: "Tricep Pushdowns", detail: "3 x 12", notes: "Cable, rope attachment" },
      { name: "Face Pulls", detail: "3 x 15", notes: "Rear delt and rotator cuff health" },
    ],
  },
  {
    day: "Tuesday",
    type: "Run",
    title: "Tempo Run",
    icon: "🏃",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    duration: "50 min",
    exercises: [
      { name: "Warm-up Jog", detail: "15 min", notes: "Easy pace, dynamic stretches at the end" },
      { name: "Tempo Effort", detail: "20 min", notes: "Comfortably hard — threshold pace" },
      { name: "Cool-down Jog", detail: "10 min", notes: "Easy pace" },
      { name: "Foam Roll", detail: "5 min", notes: "Quads, calves, IT band" },
    ],
  },
  {
    day: "Wednesday",
    type: "Lift",
    title: "Lower Body",
    icon: "🏋️",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    duration: "55 min",
    exercises: [
      { name: "Barbell Back Squat", detail: "4 x 6", notes: "Below parallel, brace core" },
      { name: "Romanian Deadlift", detail: "3 x 10", notes: "Hinge at hips, slight knee bend" },
      { name: "Walking Lunges", detail: "3 x 12 each", notes: "Dumbbells, long stride" },
      { name: "Leg Curl", detail: "3 x 12", notes: "Machine, controlled eccentric" },
      { name: "Standing Calf Raises", detail: "4 x 15", notes: "Full range of motion, pause at top" },
    ],
  },
  {
    day: "Thursday",
    type: "Run",
    title: "Easy Run",
    icon: "🏃",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    duration: "40 min",
    exercises: [
      { name: "Easy Pace Run", detail: "40 min", notes: "Conversational pace — you should be able to hold a full sentence" },
      { name: "Hip Circles", detail: "1 min", notes: "10 each direction, each leg" },
      { name: "Walking Lunges", detail: "2 min", notes: "Cool-down, 10 each leg" },
    ],
  },
  {
    day: "Saturday",
    type: "Run",
    title: "Long Run",
    icon: "🏃",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    duration: "90 min",
    exercises: [
      { name: "Easy Pace Run", detail: "80 min", notes: "Relaxed effort, build aerobic base" },
      { name: "Marathon Pace Finish", detail: "10 min", notes: "Pick up to goal marathon pace for the final stretch" },
      { name: "Walking Cool-down", detail: "5 min", notes: "Walk it out, hydrate" },
      { name: "Static Stretching", detail: "5 min", notes: "Quads, hamstrings, hip flexors, calves" },
    ],
  },
];

export default function SampleWeekPreview() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="space-y-3">
      {SAMPLE_WORKOUTS.map((w, i) => (
        <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-800/30 overflow-hidden">
          <button
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            className="w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-zinc-800/50"
          >
            <div className="w-20 flex-shrink-0">
              <p className="text-xs text-zinc-500">{w.day}</p>
              <span className={`text-xs font-medium ${w.color} ${w.bg} px-2 py-0.5 rounded-full`}>
                {w.type}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm">{w.title}</p>
              <p className="text-xs text-zinc-500">{w.duration} · {w.exercises.length} exercises</p>
            </div>
            <svg
              className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${expandedIndex === i ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedIndex === i && (
            <div className="px-4 pb-4 border-t border-zinc-800">
              <div className="mt-3 space-y-2">
                {w.exercises.map((ex, j) => (
                  <div
                    key={j}
                    className={`flex items-start gap-3 rounded-lg border ${w.border} bg-zinc-900/50 p-3`}
                  >
                    <span className="text-sm mt-0.5">{w.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-medium text-white">{ex.name}</p>
                        <span className={`text-xs font-medium ${w.color} whitespace-nowrap`}>{ex.detail}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{ex.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3 text-center">
                Tap any exercise in the app for form tips and video demos
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
