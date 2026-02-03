import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import WorkoutCard from "@/components/WorkoutCard";
import { getWorkoutsArray } from "@/lib/workouts";
import { prisma } from "@/lib/prisma";
import SubscriptionButton from "@/components/SubscriptionButton";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const isSubscribed =
    user?.stripeCurrentPeriodEnd &&
    new Date(user.stripeCurrentPeriodEnd) > new Date();

  const workouts = getWorkoutsArray();

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              Stride & <span className="text-orange-500">Steel</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-zinc-400 hidden sm:block">
                {session.user.name || session.user.email}
              </span>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Subscription Banner */}
        {!isSubscribed && (
          <div className="mb-8 rounded-xl border border-orange-500/30 bg-orange-500/10 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Unlock Full Access</h2>
                <p className="text-sm text-zinc-400">
                  Subscribe to get personalized workouts and full features.
                </p>
              </div>
              <Link
                href="/pricing"
                className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 text-center"
              >
                Subscribe - $49.99/mo
              </Link>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Welcome back, {session.user.name?.split(" ")[0] || "Athlete"}!
            </h2>
            <p className="mt-2 text-zinc-400">
              {isSubscribed
                ? "Here's your personalized hybrid training plan for this week."
                : "Preview your training plan below."}
            </p>
          </div>
          {isSubscribed && <SubscriptionButton />}
        </div>

        {/* Archetype Badge - Moved to top */}
        <div className="mb-8 rounded-xl border border-orange-500/30 bg-orange-500/10 p-6 text-center">
          <p className="text-sm text-orange-400 mb-2">Your Training Archetype</p>
          <p className="text-xl font-bold">The Balanced Athlete</p>
          <p className="text-sm text-zinc-400 mt-2">
            You thrive with equal focus on strength and endurance, building a
            well-rounded athletic foundation.
          </p>
        </div>

        {/* Subscription Status */}
        {isSubscribed && (
          <div className="mb-8 rounded-xl border border-green-500/30 bg-green-500/10 p-4 flex items-center gap-3">
            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400">
              Pro subscription active until{" "}
              {new Date(user.stripeCurrentPeriodEnd).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">3</p>
            <p className="text-sm text-zinc-500">Lift Days</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-2xl font-bold text-green-500">3</p>
            <p className="text-sm text-zinc-500">Run Days</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
            <p className="text-2xl font-bold text-purple-500">1</p>
            <p className="text-sm text-zinc-500">Recovery</p>
          </div>
        </div>

        {/* Workouts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">This Week's Workouts</h3>
          {workouts.map((workout, index) => (
            <WorkoutCard key={index} workout={workout} locked={!isSubscribed && index > 1} />
          ))}
        </div>

      </div>
    </main>
  );
}
