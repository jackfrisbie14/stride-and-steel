"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");
  const [checkoutInitiated, setCheckoutInitiated] = useState(false);

  useEffect(() => {
    // Wait for session to load
    if (status === "loading") return;

    // If no session after loading, redirect to signin
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    // Prevent double-checkout
    if (checkoutInitiated) return;
    setCheckoutInitiated(true);

    // Initiate Stripe checkout
    const initiateCheckout = async () => {
      try {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
        });

        const data = await response.json();

        if (data.error === "Already subscribed") {
          // User already has a subscription, go to dashboard
          router.push("/dashboard");
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to create checkout");
        }

        // Redirect to Stripe
        window.location.href = data.url;
      } catch (err) {
        setCheckoutInitiated(false);
        setError(err.message || "Something went wrong");
      }
    };

    initiateCheckout();
  }, [status, router, checkoutInitiated]);

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-zinc-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold transition-colors hover:bg-orange-600"
        >
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />
      <p className="mt-6 text-zinc-400">Setting up your $0.99 trial...</p>
    </main>
  );
}
