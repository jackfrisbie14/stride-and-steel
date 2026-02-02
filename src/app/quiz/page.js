"use client";

import { useState } from "react";
import Link from "next/link";

const questions = [
  {
    id: 1,
    question: "What's your primary training focus right now?",
    options: [
      "Building strength and muscle",
      "Improving running performance",
      "Equal focus on both",
      "Not sure yet",
    ],
  },
  {
    id: 2,
    question: "How many days per week can you train?",
    options: ["3 days", "4 days", "5 days", "6+ days"],
  },
  {
    id: 3,
    question: "What's your biggest challenge with hybrid training?",
    options: [
      "Feeling too tired to do both well",
      "Not seeing progress in either",
      "Don't know how to structure it",
      "Worried about injury",
    ],
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Your Hybrid Archetype:{" "}
          <span className="text-orange-500">The Balanced Athlete</span>
        </h1>

        <p className="mt-6 max-w-xl text-zinc-400">
          Based on your answers, you're ready for a structured approach that
          builds both strength and endurance without compromise.
        </p>

        <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-xl font-semibold">Get Your Custom Training Plan</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your email to receive your personalized hybrid training guide.
          </p>

          <form className="mt-6 flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Send My Training Plan
            </button>
          </form>
        </div>

        <Link href="/" className="mt-8 text-sm text-zinc-500 hover:text-zinc-300">
          &larr; Back to Home
        </Link>
      </main>
    );
  }

  const question = questions[currentQuestion];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {/* Progress bar */}
      <div className="mb-8 w-full max-w-md">
        <div className="h-2 rounded-full bg-zinc-800">
          <div
            className="h-2 rounded-full bg-orange-500 transition-all"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <h1 className="max-w-xl text-2xl font-bold sm:text-3xl">
        {question.question}
      </h1>

      <div className="mt-8 flex w-full max-w-md flex-col gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left transition-colors hover:border-orange-500 hover:bg-zinc-800"
          >
            {option}
          </button>
        ))}
      </div>

      <Link href="/" className="mt-8 text-sm text-zinc-500 hover:text-zinc-300">
        &larr; Back to Home
      </Link>
    </main>
  );
}
