"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function ExerciseModal({ exercise, exerciseName, onClose }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!exercise) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{exerciseName}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-zinc-400">Tutorial coming soon for this exercise.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{exerciseName}</h2>
            <p className="text-sm text-zinc-500">{exercise.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Exercise Image Placeholder */}
          <div className="relative w-full h-48 bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-zinc-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-zinc-500">Exercise demonstration</p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
              <p className="text-xs text-zinc-500 mb-1">Difficulty</p>
              <p className="text-sm font-medium text-orange-400">{exercise.difficulty}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
              <p className="text-xs text-zinc-500 mb-1">Equipment</p>
              <p className="text-sm font-medium">{exercise.equipment}</p>
            </div>
            <div className="col-span-2 bg-zinc-800/50 rounded-lg p-3 text-center">
              <p className="text-xs text-zinc-500 mb-1">Target Muscles</p>
              <p className="text-sm font-medium">{exercise.muscles.join(", ")}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-zinc-300">{exercise.description}</p>
          </div>

          {/* How To */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 text-sm">
                1
              </span>
              How To Perform
            </h3>
            <ol className="space-y-2">
              {exercise.steps.map((step, index) => (
                <li key={index} className="flex gap-3 text-zinc-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-800 text-zinc-500 text-xs flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-500 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              Form Tips
            </h3>
            <ul className="space-y-2">
              {exercise.tips.map((tip, index) => (
                <li key={index} className="flex gap-3 text-zinc-300">
                  <span className="flex-shrink-0 text-green-500 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-500 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              Common Mistakes to Avoid
            </h3>
            <ul className="space-y-2">
              {exercise.commonMistakes.map((mistake, index) => (
                <li key={index} className="flex gap-3 text-zinc-300">
                  <span className="flex-shrink-0 text-red-500 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
