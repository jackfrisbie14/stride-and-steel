"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Create account
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // Sign in with credentials
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error("Failed to sign in");
      }

      router.push("/results");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowSignIn(true);
    }
  };

  // Show sign-in gate after quiz completion
  if (showSignIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20">
          <svg
            className="h-10 w-10 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Quiz Complete!
        </h1>

        <p className="mt-4 max-w-md text-zinc-400">
          Create an account to discover your hybrid athlete archetype and get your personalized training plan.
        </p>

        <div className="mt-10 w-full max-w-sm">
          {!showEmailForm ? (
            <>
              <button
                onClick={() => signIn("google", { callbackUrl: "/results" })}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-sm text-zinc-500">or</span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              <button
                onClick={() => setShowEmailForm(true)}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold transition-colors hover:border-orange-500 hover:bg-zinc-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Sign up with Email
              </button>
            </>
          ) : (
            <>
              <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (optional)"
                  className="rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 8 characters)"
                  required
                  minLength={8}
                  className="rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <button
                onClick={() => setShowEmailForm(false)}
                className="mt-4 text-sm text-zinc-500 hover:text-zinc-300"
              >
                &larr; Back to other options
              </button>
            </>
          )}

          <p className="mt-6 text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/signin?callbackUrl=/results" className="text-orange-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <Link href="/" className="mt-10 text-sm text-zinc-500 hover:text-zinc-300">
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
