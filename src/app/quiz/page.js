"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { trackFunnelEvent } from "@/components/Analytics";
import { determineArchetype, archetypes } from "@/lib/archetypes";

// Static sample Day 1 workouts per archetype (for preview before signup)
const sampleWorkouts = {
  ironRunner: [
    { day: "Monday", type: "Run", title: "Tempo Run", summary: "10 min warm-up, 20 min tempo, 10 min cool-down" },
    { day: "Tuesday", type: "Lift", title: "Upper Body Strength", summary: "Bench Press, Rows, OHP, Pull-ups" },
    { day: "Wednesday", type: "Run", title: "Easy Run", summary: "30 min conversational pace" },
    { day: "Thursday", type: "Lift", title: "Lower Body Strength", summary: "Squats, RDLs, Lunges, Calf Raises" },
    { day: "Friday", type: "Run", title: "Interval Run", summary: "8x400m at 5K pace" },
  ],
  steelStrider: [
    { day: "Monday", type: "Lift", title: "Upper Body Power", summary: "Bench Press, Weighted Pull-ups, OHP, Rows" },
    { day: "Tuesday", type: "Run", title: "Easy Run", summary: "30 min conversational pace" },
    { day: "Wednesday", type: "Lift", title: "Lower Body Strength", summary: "Squats, Deadlifts, Split Squats, Hip Thrusts" },
    { day: "Thursday", type: "Run", title: "Tempo Run", summary: "10 min warm-up, 20 min tempo, 10 min cool-down" },
    { day: "Friday", type: "Lift", title: "Full Body Circuit", summary: "Power Cleans, Push-ups, Front Squats, Pull-ups" },
  ],
  balancedAthlete: [
    { day: "Monday", type: "Lift", title: "Upper Body Strength", summary: "Bench Press, Rows, OHP, Pull-ups, Face Pulls" },
    { day: "Tuesday", type: "Run", title: "Easy Run", summary: "30 min conversational pace" },
    { day: "Wednesday", type: "Lift", title: "Lower Body Strength", summary: "Squats, RDLs, Lunges, Calf Raises" },
    { day: "Thursday", type: "Run", title: "Tempo Run", summary: "10 min warm-up, 20 min tempo, 10 min cool-down" },
    { day: "Friday", type: "Recovery", title: "Active Recovery", summary: "Light walk, mobility flow, foam rolling" },
  ],
  enduranceMachine: [
    { day: "Monday", type: "Run", title: "Easy Run", summary: "40 min conversational pace" },
    { day: "Tuesday", type: "Lift", title: "Full Body Circuit", summary: "Kettlebell Swings, Squats, Push-ups, Rows" },
    { day: "Wednesday", type: "Run", title: "Tempo Run", summary: "10 min warm-up, 25 min tempo, 10 min cool-down" },
    { day: "Thursday", type: "Run", title: "Interval Run", summary: "10x400m at 5K pace" },
    { day: "Friday", type: "Recovery", title: "Active Recovery", summary: "Light walk, mobility flow, foam rolling" },
  ],
};

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
    id: 4,
    question: "What would success look like in 12 weeks?",
    options: [
      "Faster race times",
      "More strength while running",
      "Better consistency",
      "Feeling athletic year-round",
    ],
  },
  {
    id: 5,
    question: "Set your goal: Where do you want to be in 12 weeks?",
    options: [
      "Run a faster 5K or 10K while maintaining strength",
      "Add 10-20 lbs to my main lifts while staying conditioned",
      "Complete a half marathon without sacrificing muscle",
      "Build visible muscle while improving my mile time",
      "Feel stronger, faster, and more athletic overall",
    ],
  },
];

function AnalyzingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing your responses...",
    "Identifying your archetype...",
    "Building your hybrid plan...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return prev;
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>

      <h2 className="text-2xl font-bold mb-8">Building Your Plan</h2>

      <div className="w-full max-w-sm space-y-3">
        {steps.map((stepText, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 transition-all duration-300 ${
              index <= step ? "opacity-100" : "opacity-30"
            }`}
          >
            {index < step ? (
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : index === step ? (
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-zinc-600 flex-shrink-0" />
            )}
            <span className={index <= step ? "text-white" : "text-zinc-500"}>
              {stepText}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10 w-full max-w-sm">
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-1000"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </main>
  );
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [showArchetypeReveal, setShowArchetypeReveal] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [revealedArchetype, setRevealedArchetype] = useState(null);

  // Store referral param from URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && typeof window !== "undefined") {
      localStorage.setItem("referralCode", ref);
    }
  }, [searchParams]);

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

      // Track successful signup
      trackFunnelEvent("signup_complete");

      // Submit quiz answers to generate personalized workouts
      try {
        const quizRes = await fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, answers }),
        });
        if (quizRes.ok) {
          const quizData = await quizRes.json();
          if (quizData.archetype) {
            localStorage.setItem("quizArchetype", quizData.archetype);
          }
        }
      } catch (quizErr) {
        console.error("Quiz submit error:", quizErr);
      }

      router.push("/onboarding");
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
      // Last question - show analyzing screen
      setShowAnalyzing(true);
    }
  };

  const handleAnalyzingComplete = () => {
    setShowAnalyzing(false);
    // Determine archetype client-side for the reveal
    const archetype = determineArchetype(answers);
    setRevealedArchetype(archetype);
    setShowArchetypeReveal(true);
    trackFunnelEvent("archetype_reveal");
  };

  const handleGetFullPlan = () => {
    setShowArchetypeReveal(false);
    setShowSignIn(true);
    trackFunnelEvent("signup_page");
  };

  // Show analyzing screen
  if (showAnalyzing) {
    return <AnalyzingScreen onComplete={handleAnalyzingComplete} />;
  }

  // Show archetype reveal before signup gate
  if (showArchetypeReveal && revealedArchetype) {
    const typeIcons = { Run: "🏃", Lift: "🏋️", Recovery: "🧘" };
    const typeColors = { Run: "text-green-400", Lift: "text-orange-400", Recovery: "text-purple-400" };
    const preview = sampleWorkouts[revealedArchetype.key] || sampleWorkouts.balancedAthlete;

    return (
      <main className="flex min-h-screen flex-col items-center px-6 py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20">
          <svg className="h-8 w-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <p className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-2">
          Your Hybrid Archetype
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          <span className="text-orange-500">{revealedArchetype.label}</span>
        </h1>

        <p className="mt-4 max-w-md text-zinc-400">
          {revealedArchetype.description}
        </p>

        {/* Lift/Run/Recovery ratio bars */}
        <div className="mt-6 w-full max-w-sm space-y-2">
          {[
            { label: "Lifting", value: revealedArchetype.ratios.lift, color: "bg-orange-500" },
            { label: "Running", value: revealedArchetype.ratios.run, color: "bg-green-500" },
            { label: "Recovery", value: revealedArchetype.ratios.recovery, color: "bg-purple-500" },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-3">
              <span className="w-20 text-right text-sm text-zinc-400">{r.label}</span>
              <div className="flex-1 h-3 rounded-full bg-zinc-800 overflow-hidden">
                <div className={`h-full ${r.color} rounded-full transition-all duration-700`} style={{ width: `${r.value}%` }} />
              </div>
              <span className="w-10 text-sm text-zinc-500">{r.value}%</span>
            </div>
          ))}
        </div>

        {/* Sample week preview */}
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-3">
            Sample Week Preview
          </h3>
          <div className="space-y-2">
            {preview.map((w, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left">
                <span className="text-lg">{typeIcons[w.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">{w.day}</span>
                    <span className={`text-xs font-medium ${typeColors[w.type]}`}>{w.type}</span>
                  </div>
                  <p className="text-sm font-medium text-white truncate">{w.title}</p>
                  <p className="text-xs text-zinc-500 truncate">{w.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 w-full max-w-md">
          <p className="text-zinc-400 mb-4">
            Want your full personalized plan? Sign up free.
          </p>
          <button
            onClick={handleGetFullPlan}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg font-bold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:scale-[1.02] shadow-lg shadow-orange-500/25"
          >
            Get My Full Plan →
          </button>
          <p className="mt-3 text-xs text-zinc-500">
            Free 7-day trial · Cancel anytime · The PR-or-Free Promise
          </p>
        </div>

        <Link href="/welcome" className="mt-8 text-sm text-zinc-500 hover:text-zinc-300">
          ← Back to Home
        </Link>
      </main>
    );
  }

  // Show sign-in gate
  if (showSignIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {revealedArchetype && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2">
            <span className="text-sm text-orange-400 font-medium">{revealedArchetype.label}</span>
          </div>
        )}

        <h1 className="text-3xl font-bold sm:text-4xl">
          Get Your Full Plan
        </h1>

        <p className="mt-4 max-w-md text-zinc-400">
          Create a free account to unlock your complete personalized training plan with daily workouts.
        </p>

        <div className="mt-10 w-full max-w-sm">
          {!showEmailForm ? (
            <>
              <button
                onClick={() => {
                  // Store quiz answers in localStorage before OAuth redirect
                  if (typeof window !== "undefined") {
                    localStorage.setItem("quizAnswers", JSON.stringify(answers));
                  }
                  signIn("google", { callbackUrl: "/onboarding" });
                }}
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
                ← Back to other options
              </button>
            </>
          )}

          <p className="mt-6 text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/?callbackUrl=/onboarding" className="text-orange-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <Link href="/welcome" className="mt-10 text-sm text-zinc-500 hover:text-zinc-300">
          ← Back to Home
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

      <Link href="/welcome" className="mt-8 text-sm text-zinc-500 hover:text-zinc-300">
        ← Back to Home
      </Link>
    </main>
  );
}

export default function Quiz() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" /></div>}>
      <QuizContent />
    </Suspense>
  );
}
