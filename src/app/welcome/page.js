import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel";
import SampleWeekPreview from "@/components/SampleWeekPreview";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Section 1: Hero */}
      <section className="px-6 py-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-4">
                The Hybrid Athlete System
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Finally — A Training Plan for People Who Refuse to Choose Between{" "}
                <span className="text-orange-500">Fast and Strong</span>
              </h1>

              <p className="mt-6 text-lg text-zinc-400 sm:text-xl">
                The Hybrid Athlete System gives you a personalized, periodized
                plan that builds running speed and lifting strength at the same
                time — in just 4-5 hours per week.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/quiz"
                  className="rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Take the 30-Second Quiz &rarr;
                </Link>
              </div>

              <p className="mt-6 text-sm text-zinc-500">
                Free 7-day trial &middot; Cancel anytime &middot; The PR-or-Free
                Guarantee
              </p>
            </div>

            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* Section 2: Problem Agitation — "Sound Familiar?" */}
      <section className="bg-zinc-900 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Sound Familiar?
          </h2>

          <div className="mt-12 space-y-4 max-w-2xl mx-auto">
            {[
              "You love running but skip the gym because you have no idea how to fit lifting in...",
              "You're terrified that lifting will make you slow — or that running will kill your gains...",
              'You\'ve Googled "hybrid training plan" and gotten 50 conflicting answers...',
              "You've tried combining both and ended up overtrained, injured, or burned out...",
              "You know you need a plan — but you're spending more time planning than actually training...",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl bg-zinc-800/50 border border-zinc-800 p-4"
              >
                <span className="mt-0.5 text-orange-400 flex-shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                </span>
                <p className="text-zinc-300">{item}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-zinc-400 text-lg font-semibold">
            You don&apos;t need more motivation. You need a system.
          </p>
        </div>
      </section>

      {/* Section 3: How It Works — "Your Plan in 3 Steps" */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Your Plan in{" "}
            <span className="text-orange-500">3 Steps</span>
          </h2>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 text-xl font-bold">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Take the 30-Second Quiz
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Tell us your goals, experience, and schedule. That&apos;s it.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 text-xl font-bold">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Get Your Hybrid Archetype
              </h3>
              <p className="mt-2 text-sm text-zinc-400">
                Our system identifies your training profile — Iron Runner, Steel
                Strider, Balanced Athlete, or Endurance Machine — and builds
                your plan around it.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 p-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 text-xl font-bold">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold">Train This Week</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Open the app. See today&apos;s workout. Do it. Every run, every
                lift, every recovery day — programmed and ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: The Offer — Value Stack */}
      <section className="bg-zinc-900 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Everything Inside the{" "}
            <span className="text-orange-500">Hybrid Athlete System</span>
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            {[
              {
                title: "The Hybrid Engine",
                desc: "Personalized weekly plans that auto-balance your running volume and lifting load.",
              },
              {
                title: "The No-Compromise Protocol",
                desc: "Science-based session sequencing so running doesn't kill your gains (and lifting doesn't slow you down).",
              },
              {
                title: "The 4-Hour Athlete Blueprint",
                desc: "Full programming designed for people with 4-5 hours per week — not 15.",
              },
              {
                title: "The Bulletproof Base",
                desc: "Built-in recovery days, deload logic, and injury prevention.",
              },
              {
                title: "Daily Directive",
                desc: "Open the app, see today's workout — zero guesswork, zero planning.",
              },
              {
                title: "Dual PR Tracker",
                desc: "Track your lifts AND your run times on one dashboard.",
              },
              {
                title: "Auto-Progression",
                desc: "Built-in progressive overload and periodization — your plan evolves as you do.",
              },
              {
                title: "Exercise Library",
                desc: "Tap any exercise for form tips, step-by-step instructions, and video demos.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-800/30 p-5"
              >
                <span className="mt-1 text-orange-500 flex-shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="font-semibold text-white">{f.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Sample Week Preview */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl mb-4">
            Here&apos;s What a Week Actually Looks Like
          </h2>
          <p className="text-center text-zinc-500 mb-10 text-sm">
            Sample plan for a 5-day hybrid athlete training for a half marathon
          </p>

          <SampleWeekPreview />

          <p className="text-center mt-6 text-xs text-zinc-600">
            Your plan will be different — tailored to your archetype,
            experience, and goals.
          </p>
        </div>
      </section>

      {/* Section 6: Social Proof — Founder Story */}
      <section className="bg-zinc-900 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Built by a Hybrid Athlete,{" "}
            <span className="text-orange-500">for Hybrid Athletes</span>
          </h2>

          <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-800/30 p-8 sm:p-10">
            <svg
              className="mx-auto h-8 w-8 text-orange-500/40 mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <blockquote className="text-lg text-zinc-300 leading-relaxed sm:text-xl">
              &ldquo;I built Stride & Steel because I couldn&apos;t find a plan
              that balanced both. I used it to PR in my marathon and my
              triathlon — injury free. Now I want to give every hybrid athlete
              the same system.&rdquo;
            </blockquote>
            <p className="mt-6 text-sm font-semibold text-orange-400">
              — Jack Frisbie, Founder
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: The Guarantee — "The PR-or-Free Promise" */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-xl border-2 border-orange-500/30 bg-orange-500/5 p-8 sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-4">
              Our Guarantee
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              The PR-or-Free Promise
            </h2>

            <p className="mt-6 text-zinc-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Train with Stride & Steel for 90 days. Follow the plan. If you
              haven&apos;t set at least one personal record — in the gym or on
              the road — we&apos;ll refund every penny. All 3 months. No
              questions asked.
            </p>

            <p className="mt-4 text-orange-400 font-semibold text-lg">
              You literally cannot lose. Either you PR, or you train free.
            </p>

            <div className="mt-8 border-t border-zinc-800 pt-6">
              <p className="text-sm text-zinc-500">
                Start with a free 7-day trial. Cancel anytime before it ends and
                pay nothing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Scarcity — Early Adopter Pricing */}
      <section className="bg-zinc-900 px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Early Adopter Launch Pricing
          </h2>

          <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-800/30 p-8 sm:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-700 p-4 text-center">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Monthly</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg text-zinc-500 line-through">$49.99</span>
                  <span className="text-3xl font-bold text-green-400">$19.99</span>
                  <span className="text-sm text-zinc-400">/mo</span>
                </div>
              </div>
              <div className="rounded-lg border-2 border-orange-500 p-4 text-center relative">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">BEST VALUE</span>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Annual</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg text-zinc-500 line-through">$399.99</span>
                  <span className="text-3xl font-bold text-green-400">$149.99</span>
                  <span className="text-sm text-zinc-400">/yr</span>
                </div>
                <p className="text-xs text-green-400 mt-1">$12.50/mo — save 37%</p>
              </div>
            </div>

            <p className="mt-6 text-zinc-400">
              We&apos;re in early launch and rewarding our first members. This
              price won&apos;t last.
            </p>

            <p className="mt-2 text-sm font-semibold text-orange-400">
              Lock in early adopter pricing for life by joining now — before we raise it
              back.
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Stop Planning. Start Training.
          </h2>

          <p className="mt-4 text-zinc-400">
            Take the 30-second quiz. Get your hybrid archetype. Start your free
            trial.
          </p>

          <Link
            href="/quiz"
            className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Your Free Training Plan &rarr;
          </Link>

          <p className="mt-6 text-sm text-zinc-500">
            Free 7-day trial &middot; Cancel anytime &middot; The PR-or-Free
            Promise
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8">
        <div className="mx-auto max-w-4xl text-center text-sm text-zinc-500">
          <p>
            &copy; {new Date().getFullYear()} Stride & Steel. All rights
            reserved.
          </p>
          <div className="mt-6 text-xs text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            <p className="font-semibold text-zinc-500 mb-2">Disclaimer</p>
            <p>
              Stride & Steel provides general fitness information and
              AI-generated training plans for educational purposes only. This
              content is not medical advice and is not intended to diagnose,
              treat, cure, or prevent any condition or disease. Always consult a
              qualified healthcare provider or certified fitness professional
              before beginning any exercise program, especially if you have
              pre-existing health conditions, injuries, or concerns.
            </p>
            <p className="mt-2">
              By using this service, you acknowledge that all physical activity
              carries inherent risks of injury. Stride & Steel, its owners,
              employees, and affiliates assume no liability for any injuries,
              damages, or losses resulting from the use of information or
              training plans provided through this platform. You participate in
              any suggested workouts entirely at your own risk.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
