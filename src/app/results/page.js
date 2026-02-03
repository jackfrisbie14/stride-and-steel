"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Results() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/quiz");
    }
  }, [status, router]);

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
        &larr; Back to Home
      </Link>
    </main>
  );
}
