"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const onboardingQuestions = [
  {
    id: "trainingDays",
    question: "How many days per week can you train?",
    options: ["3 days", "4 days", "5 days", "6+ days"],
  },
  {
    id: "experience",
    question: "How long have you been training?",
    options: [
      "Beginner (less than 1 year)",
      "Intermediate (1-3 years)",
      "Advanced (3+ years)",
      "On and off / inconsistent",
    ],
  },
  {
    id: "raceStatus",
    question: "Do you have a race coming up?",
    options: [
      "Yes — within 3 months",
      "Yes — 3-6 months out",
      "Not right now",
      "I train without racing",
    ],
  },
  {
    id: "gender",
    question: "How do you identify?",
    options: [
      "Man",
      "Woman",
      "Non-binary",
      "Prefer to self-describe",
      "Prefer not to say",
    ],
  },
];

function HeightWeightStep({ onSubmit }) {
  const [unit, setUnit] = useState("imperial");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [cm, setCm] = useState("");
  const [lbs, setLbs] = useState("");
  const [kg, setKg] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const [heightInches, setHeightInches] = useState(70);
  const [heightCm, setHeightCm] = useState(178);
  const [weightLbs, setWeightLbs] = useState(175);
  const [weightKg, setWeightKg] = useState(79);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmit = () => {
    let height, weight;
    if (unit === "imperial") {
      if (isMobile) {
        const ft = Math.floor(heightInches / 12);
        const inch = heightInches % 12;
        height = `${ft}'${inch}"`;
        weight = `${weightLbs} lbs`;
      } else {
        height = `${feet}'${inches}"`;
        weight = `${lbs} lbs`;
      }
    } else {
      if (isMobile) {
        height = `${heightCm} cm`;
        weight = `${weightKg} kg`;
      } else {
        height = `${cm} cm`;
        weight = `${kg} kg`;
      }
    }
    onSubmit({ height, weight, unit });
  };

  const isValid = isMobile
    ? true
    : unit === "imperial"
      ? feet && inches && lbs
      : cm && kg;

  const formatHeightFromInches = (totalInches) => {
    const ft = Math.floor(totalInches / 12);
    const inch = totalInches % 12;
    return `${ft}'${inch}"`;
  };

  return (
    <>
      <h2 className="max-w-xl text-2xl font-bold sm:text-3xl mb-8">
        What&apos;s your height and weight?
      </h2>

      <div className="flex gap-2 mb-8 p-1 bg-zinc-800 rounded-lg">
        <button
          onClick={() => setUnit("imperial")}
          className={`px-4 py-2 rounded-md transition-colors ${
            unit === "imperial" ? "bg-orange-500 text-white" : "text-zinc-400"
          }`}
        >
          Imperial (ft/lbs)
        </button>
        <button
          onClick={() => setUnit("metric")}
          className={`px-4 py-2 rounded-md transition-colors ${
            unit === "metric" ? "bg-orange-500 text-white" : "text-zinc-400"
          }`}
        >
          Metric (cm/kg)
        </button>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div>
          <label className="block text-left text-sm text-zinc-400 mb-2">Height</label>
          {isMobile ? (
            <div className="space-y-3">
              <div className="text-center text-2xl font-bold text-orange-500">
                {unit === "imperial" ? formatHeightFromInches(heightInches) : `${heightCm} cm`}
              </div>
              <input
                type="range"
                min={unit === "imperial" ? 48 : 120}
                max={unit === "imperial" ? 84 : 220}
                value={unit === "imperial" ? heightInches : heightCm}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (unit === "imperial") setHeightInches(val);
                  else setHeightCm(val);
                }}
                className="w-full h-3 rounded-full appearance-none cursor-pointer bg-zinc-700 accent-orange-500"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>{unit === "imperial" ? "4'0\"" : "120 cm"}</span>
                <span>{unit === "imperial" ? "7'0\"" : "220 cm"}</span>
              </div>
            </div>
          ) : (
            <>
              {unit === "imperial" ? (
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      placeholder="5"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-center text-xl focus:border-orange-500 focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">ft</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      placeholder="10"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-center text-xl focus:border-orange-500 focus:outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">in</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={cm}
                    onChange={(e) => setCm(e.target.value)}
                    placeholder="178"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-center text-xl focus:border-orange-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">cm</span>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <label className="block text-left text-sm text-zinc-400 mb-2">Weight</label>
          {isMobile ? (
            <div className="space-y-3">
              <div className="text-center text-2xl font-bold text-orange-500">
                {unit === "imperial" ? `${weightLbs} lbs` : `${weightKg} kg`}
              </div>
              <input
                type="range"
                min={unit === "imperial" ? 80 : 35}
                max={unit === "imperial" ? 350 : 160}
                value={unit === "imperial" ? weightLbs : weightKg}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (unit === "imperial") setWeightLbs(val);
                  else setWeightKg(val);
                }}
                className="w-full h-3 rounded-full appearance-none cursor-pointer bg-zinc-700 accent-orange-500"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>{unit === "imperial" ? "80 lbs" : "35 kg"}</span>
                <span>{unit === "imperial" ? "350 lbs" : "160 kg"}</span>
              </div>
            </div>
          ) : (
            <>
              {unit === "imperial" ? (
                <div className="relative">
                  <input
                    type="number"
                    value={lbs}
                    onChange={(e) => setLbs(e.target.value)}
                    placeholder="175"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-center text-xl focus:border-orange-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">lbs</span>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={kg}
                    onChange={(e) => setKg(e.target.value)}
                    placeholder="79"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-4 text-center text-xl focus:border-orange-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">kg</span>
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full rounded-xl bg-orange-500 px-6 py-4 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </>
  );
}

export default function Onboarding() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = onboardingQuestions.length + 1; // +1 for height/weight

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/quiz");
    }
  }, [status, router]);

  // For Google OAuth users, submit stored quiz answers
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email && typeof window !== "undefined") {
      const storedAnswers = localStorage.getItem("quizAnswers");
      if (storedAnswers) {
        const answers = JSON.parse(storedAnswers);
        fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email, answers }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.archetype) {
              localStorage.setItem("quizArchetype", data.archetype);
            }
            localStorage.removeItem("quizAnswers");
          })
          .catch((err) => console.error("Quiz submit error:", err));
      }
    }
  }, [status, session]);

  const handleAnswer = (answer) => {
    const questionId = onboardingQuestions[currentStep].id;
    const newAnswers = { ...onboardingAnswers, [questionId]: answer };
    setOnboardingAnswers(newAnswers);
    setCurrentStep(currentStep + 1);
  };

  const handleHeightWeight = async (data) => {
    const finalAnswers = {
      ...onboardingAnswers,
      height: data.height,
      weight: data.weight,
      heightWeightUnit: data.unit,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers),
      });

      if (!res.ok) {
        throw new Error("Failed to save onboarding data");
      }

      // Store data for results page BMI/calorie calculations
      if (typeof window !== "undefined") {
        localStorage.setItem("quizHeightWeight", JSON.stringify(data));
        if (finalAnswers.gender) {
          localStorage.setItem("quizGender", finalAnswers.gender);
        }
      }

      router.push("/dashboard?welcome=true");
    } catch (err) {
      console.error("Onboarding submit error:", err);
      // Still redirect on error — defaults will be used
      router.push("/dashboard?welcome=true");
    }
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />
      </main>
    );
  }

  if (!session) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-4">
        Let's Build Your Plan
      </p>

      <h1 className="mb-8 text-3xl font-bold sm:text-4xl">
        Customize Your Training
      </h1>

      {/* Progress bar */}
      <div className="mb-8 w-full max-w-md">
        <div className="h-2 rounded-full bg-zinc-800">
          <div
            className="h-2 rounded-full bg-orange-500 transition-all"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </div>

      {currentStep < onboardingQuestions.length ? (
        <>
          <h2 className="max-w-xl text-2xl font-bold sm:text-3xl">
            {onboardingQuestions[currentStep].question}
          </h2>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3">
            {onboardingQuestions[currentStep].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left transition-colors hover:border-orange-500 hover:bg-zinc-800"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      ) : (
        <HeightWeightStep onSubmit={handleHeightWeight} />
      )}

      {isSubmitting && (
        <div className="mt-6 flex items-center gap-2 text-zinc-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <span className="text-sm">Saving your preferences...</span>
        </div>
      )}

      <Link href="/welcome" className="mt-8 text-sm text-zinc-500 hover:text-zinc-300">
        ← Back to Home
      </Link>
    </main>
  );
}
