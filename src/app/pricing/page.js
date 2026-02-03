"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pricing() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const canceled = searchParams.get("canceled");

  const handleSubscribe = async () => {
    if (!session) {
      window.location.href = "/signin";
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        {canceled && (
          <div className="mb-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4 text-yellow-500">
            Checkout was canceled. You can try again when you're ready.
          </div>
        )}

        <h1 className="text-4xl font-bold sm:text-5xl">
          Unlock Your Full <span className="text-orange-500">Training Potential</span>
        </h1>

        <p className="mt-6 text-lg text-zinc-400">
          Get access to personalized hybrid training programs, weekly workout plans,
          and everything you need to run fast and lift strong.
        </p>

        {/* Pricing Card */}
        <div className="mt-12 mx-auto max-w-md rounded-2xl border border-orange-500/30 bg-zinc-900 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Stride & Steel Pro</h2>
            <p className="mt-2 text-zinc-400">Full access to all features</p>

            <div className="mt-6">
              <span className="text-5xl font-bold">$49.99</span>
              <span className="text-zinc-400">/month</span>
            </div>

            <ul className="mt-8 space-y-4 text-left">
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Personalized weekly workout plans
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Hybrid training programs (run + lift)
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Progress tracking dashboard
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                New workouts every week
              </li>
              <li className="flex items-center gap-3">
                <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </li>
            </ul>

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Start Your Subscription"}
            </button>

            <p className="mt-4 text-sm text-zinc-500">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>

        <Link href="/" className="mt-8 inline-block text-sm text-zinc-500 hover:text-zinc-300">
          &larr; Back to Home
        </Link>
      </div>
    </main>
  );
}
