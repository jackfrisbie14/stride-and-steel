"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const questions = [
  {
    id: 1,
    question: "Which best describes you right now?",
    options: [
      "🏃 Marathon runner who wants to stay strong",
      "🏊‍♂️ Triathlete who lifts (or wants to)",
      "🏋️ Lifter who runs (or wants to)",
      "🔁 Hybrid athlete doing both",
      "🤔 Not sure, but I want to train smarter",
    ],
  },
  {
    id: 2,
    question: "What's your main goal right now?",
    options: [
      "Run faster without losing muscle",
      "Build strength without hurting endurance",
      "Balance both long-term",
      "Prepare for an upcoming race",
      "Train consistently without burnout",
    ],
  },
  {
    id: 3,
    question: "How many days per week can you realistically train?",
    options: ["3 days", "4 days", "5 days", "6+ days"],
  },
  {
    id: 4,
    question: "How would you describe your training experience?",
    options: [
      "Beginner (less than 1 year)",
      "Intermediate (1–3 years)",
      "Advanced (3+ years)",
      "On and off / inconsistent",
    ],
  },
  {
    id: 5,
    question: "What's been your biggest challenge with training?",
    options: [
      "Feeling slow when I lift",
      "Feeling weak when I run more",
      "Fatigue / overtraining",
      "Lack of structure",
      "Injuries or nagging pain",
    ],
  },
  {
    id: 6,
    question: "Do you have a race coming up?",
    options: [
      "Yes — within 3 months",
      "Yes — 3–6 months out",
      "Not right now",
      "I train without racing",
    ],
  },
  {
    id: 7,
    question: "What would success look like in 12 weeks?",
    options: [
      "Faster race times",
      "More strength while running",
      "Better consistency",
      "Feeling athletic year-round",
    ],
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show sign-up prompt after email submission
  if (isSubmitted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Check Your <span className="text-orange-500">Inbox!</span>
        </h1>

        <p className="mt-4 max-w-md text-zinc-400">
          We've sent your personalized training plan to <strong>{email}</strong>.
          Check your email for your week of hybrid workouts.
        </p>

        <div className="mt-10 w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-xl font-semibold">
            Want to Track Your Progress?
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Create an account to access your dashboard and personalized training
            features.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/checkout" })}
              className="flex items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3 font-medium transition-colors hover:border-orange-500 hover:bg-zinc-700"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

          </div>
        </div>

        <Link
          href="/"
          className="mt-8 text-sm text-zinc-500 hover:text-zinc-300"
        >
          &larr; Back to Home
        </Link>
      </main>
    );
  }

  // Show results with email form
  if (showResult) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
        <div className="relative mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-orange-500">
          <Image
            src="/tripicture.jpg"
            alt="Hybrid Athlete"
            fill
            className="object-cover"
          />
        </div>

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

          <form onSubmit={handleSubmitEmail} className="mt-6 flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send My Training Plan"}
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
      {/* Header */}
      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">
        Take Our Quiz to Get Your{" "}
        <span className="text-orange-500">Custom Training Plan!</span>
      </h1>

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

      <h2 className="max-w-xl text-2xl font-bold sm:text-3xl">
        {question.question}
      </h2>

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
