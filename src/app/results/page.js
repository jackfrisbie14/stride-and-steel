"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

function CommitmentScreen({ onCommit }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <span className="text-6xl mb-6 block">🎉</span>

        <h1 className="text-3xl font-bold sm:text-4xl mb-4">
          Almost done!
        </h1>

        <p className="text-xl text-zinc-400 mb-10">
          Are you ready to make the commitment?
        </p>

        <div className="w-full max-w-md space-y-3">
          <button
            onClick={() => onCommit("today")}
            className="w-full rounded-xl bg-orange-500 px-6 py-4 text-left font-semibold text-white transition-colors hover:bg-orange-600"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <span>Yes! I will do my first workout today!</span>
            </span>
          </button>

          <button
            onClick={() => onCommit("tomorrow")}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-left font-semibold transition-colors hover:border-orange-500 hover:bg-zinc-800"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">💪</span>
              <span>Yes, I will do my first workout tomorrow</span>
            </span>
          </button>

          <button
            onClick={() => onCommit("not-ready")}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-6 py-4 text-left text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">🤔</span>
              <span>I'm not ready to make the commitment</span>
            </span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default function Results() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCommitment, setShowCommitment] = useState(true);
  const [commitment, setCommitment] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/quiz");
    }
  }, [status, router]);

  const handleCommit = (choice) => {
    setCommitment(choice);
    setShowCommitment(false);
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />
      </main>
    );
  }

  if (!session) {
    return null;
  }

  if (showCommitment) {
    return <CommitmentScreen onCommit={handleCommit} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      {/* Commitment reminder */}
      {commitment === "today" && (
        <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-3">
          <p className="text-green-400 font-medium">
            🔥 You committed to starting today — let's go!
          </p>
        </div>
      )}
      {commitment === "tomorrow" && (
        <div className="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/10 px-6 py-3">
          <p className="text-orange-400 font-medium">
            💪 You committed to starting tomorrow — we'll be ready!
          </p>
        </div>
      )}

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

      <div className="mt-8 max-w-md space-y-4 text-left">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-zinc-300">Personalized weekly training schedule</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-zinc-300">Strength & endurance workouts that work together</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-zinc-300">Progress tracking dashboard</p>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-10 inline-block rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600"
      >
        Get Your Training Plan
      </Link>

      <p className="mt-4 text-sm text-zinc-500">
        Start building speed and strength today
      </p>

      <Link href="/" className="mt-8 text-sm text-zinc-500 hover:text-zinc-300">
        ← Back to Home
      </Link>
    </main>
  );
}
