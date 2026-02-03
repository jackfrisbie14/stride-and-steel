import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header with Logo */}
      <header className="px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Stride & Steel"
              width={180}
              height={90}
              className="h-16 w-auto sm:h-20"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Run Fast. Lift Strong.{" "}
                <span className="text-orange-500">Train Without Tradeoffs.</span>
              </h1>

              <p className="mt-6 text-lg text-zinc-400 sm:text-xl">
                A custom training system that builds speed, strength, and durability —
                without burning you out or wrecking your lifts.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/quiz"
                  className="rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  Start the 60 Second Assessment
                </Link>
              </div>

              <p className="mt-6 text-sm text-zinc-500">
                Takes 60 Seconds · No Equipment · No Commitment
              </p>
            </div>

            {/* Hero Images */}
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-zinc-900 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Tired of Choosing Between Running and Lifting?
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl bg-zinc-800 p-6 text-left">
              <h3 className="text-xl font-semibold text-orange-500">
                The Runner's Dilemma
              </h3>
              <p className="mt-3 text-zinc-400">
                You want to build strength, but you're afraid lifting will slow
                you down or add bulk that kills your pace.
              </p>
            </div>

            <div className="rounded-xl bg-zinc-800 p-6 text-left">
              <h3 className="text-xl font-semibold text-orange-500">
                The Lifter's Dilemma
              </h3>
              <p className="mt-3 text-zinc-400">
                You want better cardio and endurance, but you're worried running
                will eat into your gains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            No Guesswork. No Overtraining.{" "}
            <span className="text-orange-500">No Sacrificing One Goal for Another.</span>
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 p-6">
              <div className="text-4xl">🎯</div>
              <h3 className="mt-4 text-lg font-semibold">Personalized Training</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Based on your unique hybrid archetype
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 p-6">
              <div className="text-4xl">⚖️</div>
              <h3 className="mt-4 text-lg font-semibold">Balanced Structure</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Weekly programming for both running and lifting
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 p-6">
              <div className="text-4xl">📈</div>
              <h3 className="mt-4 text-lg font-semibold">Progressive Results</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Performance gains without overtraining
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-zinc-900 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Discover Your Training Archetype
          </h2>

          <p className="mt-4 text-zinc-400">
            Take the free 60-second assessment and get a personalized training
            approach built for your goals.
          </p>

          <Link
            href="/quiz"
            className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Start the Assessment
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto max-w-4xl text-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Stride & Steel. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
