"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const MONTHLY_PRICE = 19.99;
const MONTHLY_ORIGINAL = 49.99;
const ANNUAL_PRICE = 149.99;
const ANNUAL_ORIGINAL = 399.99;
const ANNUAL_MONTHLY_EQUIV = (ANNUAL_PRICE / 12).toFixed(2);
const TRIAL_DAYS = 7;

function TermsModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold">Subscription Terms & Refund Policy</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-zinc-300">
          <p className="text-zinc-400 italic">
            Please note that to the extent permitted by applicable law, all purchases are non-refundable and/or non-exchangeable, unless otherwise stated herein or required by applicable law.
          </p>

          {/* Section 1 */}
          <h3 className="text-white font-bold text-base pt-4 border-t border-zinc-800">1. THE PR-OR-FREE PROMISE (90-DAY GUARANTEE)</h3>
          <p>
            Train with Stride & Steel for 90 days. Follow the plan. If none of your lifts or endurance markers improve — we&apos;ll refund every penny. All 3 months. No questions asked.
          </p>
          <p className="mt-2">
            To be eligible for a refund under the PR-or-Free Promise, <strong className="text-white">all</strong> of the following conditions must be met:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You must maintain an active subscription for the full 90 days.</li>
            <li>You must complete at least 75% of your scheduled workouts during the 90-day period, as verified via your dashboard workout logs. This minimum usage requirement ensures you&apos;ve given the program a genuine effort.</li>
            <li>You must request your refund within 7 days of the 90-day mark by emailing{" "}
              <a href="mailto:support@strideandsteel.com" className="text-orange-400 hover:underline">support@strideandsteel.com</a>
              {" "}with a dashboard screenshot showing your workout history.
            </li>
            <li>We will review your application and notify you (by email) whether your application is approved.</li>
          </ul>

          {/* Section 2 */}
          <h3 className="text-white font-bold text-base pt-4 border-t border-zinc-800">2. GENERAL REFUND RULES</h3>
          <p>
            Generally, if you do not meet the conditions set out above, the fees you have paid are non-refundable and non-exchangeable, unless otherwise stated herein or required by applicable law.
          </p>

          <div className="space-y-4 pl-4 border-l-2 border-zinc-700">
            <div>
              <h4 className="text-white font-semibold">Note for residents of US states (California)</h4>
              <p className="text-zinc-400">
                If you reside in California and cancel the purchase at any time prior to midnight of the third business day after the date of such purchase, we will return the payment you have made.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold">Note for EU residents</h4>
              <p className="text-zinc-400">
                If you are an EU user, you have a period of 14 days to withdraw from a contract, without giving any reason, and without incurring any costs. The cancellation period will expire after 14 days from your purchase of the Service.
              </p>
              <p className="text-zinc-400 mt-2">
                To exercise the right of withdrawal, you must inform us of your decision to withdraw from this contract by email at{" "}
                <a href="mailto:support@strideandsteel.com" className="text-orange-400 hover:underline">support@strideandsteel.com</a>.
                To meet the withdrawal deadline, it is sufficient for you to send your communication before the withdrawal period has expired.
              </p>
              <p className="text-zinc-400 mt-2">
                If you withdraw from this contract, we shall reimburse you for all payments received from you without undue delay, and in any event not later than 14 days from the day on which we are informed about your decision. We will carry out such reimbursement using the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise.
              </p>
              <p className="text-zinc-400 mt-2">
                If you have provided your prior express consent to begin the performance during the right of withdrawal period and acknowledgment that you will lose your right of withdrawal, then you will not be eligible for a refund in relation to digital content and will only be eligible for a proportional refund in relation to digital service.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold">Note for Brazil residents</h4>
              <p className="text-zinc-400">
                In accordance with Brazilian Consumer Protection Law, you have the right to cancel your purchase of the Service within seven (7) calendar days from the date of purchase, without providing any reason. If you exercise this right, we will refund the full amount paid without undue delay using the same payment method used for the original transaction.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <h3 className="text-white font-bold text-base pt-4 border-t border-zinc-800">3. HOW TO REQUEST A REFUND</h3>
          <p>
            If you are eligible for a refund, as outlined herein or required by applicable law, and would like to request one, please follow the instructions below:
          </p>

          <div className="space-y-3">
            <div className="bg-zinc-800/30 rounded-lg p-3">
              <h4 className="text-white font-semibold">App Store Purchases</h4>
              <p className="text-zinc-400">
                If you purchased a subscription through the App Store, please note that refunds are handled by Apple. To request a refund, follow the instructions provided on the Apple support page.
              </p>
            </div>

            <div className="bg-zinc-800/30 rounded-lg p-3">
              <h4 className="text-white font-semibold">Google Play Store or Website Purchases</h4>
              <p className="text-zinc-400">
                If you purchased a subscription using your Google Play Store account or directly through our website, please contact our support team at{" "}
                <a href="mailto:support@strideandsteel.com" className="text-orange-400 hover:underline">support@strideandsteel.com</a>.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <h3 className="text-white font-bold text-base pt-4 border-t border-zinc-800">4. SUBSCRIPTION TERMS</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your subscription begins with a free {TRIAL_DAYS}-day trial period. A temporary authorization hold may appear on your card to verify your payment method. After the trial period, your subscription will automatically renew at ${MONTHLY_PRICE}/month unless you cancel before the trial ends.</li>
            <li>Subsequent renewals will be charged at the standard subscription rate of ${MONTHLY_PRICE}/month.</li>
            <li>You may cancel your subscription at any time through your account Settings or by contacting support. Cancellation will take effect at the end of your current billing period.</li>
            <li>No refunds or credits will be provided for partial billing periods upon cancellation.</li>
          </ul>

          <p className="text-zinc-500 text-xs pt-6 border-t border-zinc-800">
            Last updated: February 2026. Stride & Steel reserves the right to modify these terms at any time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const [showTerms, setShowTerms] = useState(false);
  const [plan, setPlan] = useState("annual"); // Default to annual

  const isAnnual = plan === "annual";
  const displayPrice = isAnnual ? ANNUAL_PRICE : MONTHLY_PRICE;
  const originalPrice = isAnnual ? ANNUAL_ORIGINAL : MONTHLY_ORIGINAL;
  const billingLabel = isAnnual ? "/year" : "/month";
  const checkoutHref = isAnnual ? "/checkout?plan=annual" : "/checkout?plan=monthly";

  return (
    <div className="w-full max-w-lg mx-auto mt-12">
      {/* Plan Toggle */}
      <div className="flex items-center justify-center gap-1 mb-6 p-1 bg-zinc-800 rounded-lg w-fit mx-auto">
        <button
          onClick={() => setPlan("monthly")}
          className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
            !isAnnual ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setPlan("annual")}
          className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
            isAnnual ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Annual
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            Save 37%
          </span>
        </button>
      </div>

      {/* Main Pricing Card */}
      <div className="relative rounded-2xl border-2 border-orange-500 bg-gradient-to-b from-zinc-900 to-zinc-950 overflow-hidden">
        {/* Badge */}
        <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
          {isAnnual ? "BEST VALUE" : "MOST POPULAR"}
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-bold text-center mb-2">Hybrid Athlete Pro</h3>
          <p className="text-zinc-400 text-center mb-6">Complete training system for runners who lift</p>

          {/* Trial Price */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-bold text-white">FREE</span>
            </div>
            <p className="text-lg text-orange-400 font-medium mt-2">{TRIAL_DAYS}-day trial</p>
            <div className="mt-2">
              <span className="text-zinc-500 text-sm line-through">${originalPrice}{billingLabel}</span>
              <span className="text-green-400 text-sm font-semibold ml-2">${displayPrice}{billingLabel}</span>
            </div>
            {isAnnual && (
              <p className="text-green-400 text-xs font-medium mt-1">${ANNUAL_MONTHLY_EQUIV}/mo billed annually</p>
            )}
            <p className="text-orange-400 text-xs font-medium mt-1">Early Adopter Launch Discount</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              "Personalized 7-day hybrid training plan",
              "Strength workouts (3x/week)",
              "Running programs (3x/week)",
              "Active recovery sessions",
              "Progress tracking dashboard",
              "Pre & post workout assessments",
              "Weight logging for all lifts",
              "Race-specific training adjustments",
              "New workouts every week",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                  <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-zinc-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href={checkoutHref}
            className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-center text-lg font-bold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:scale-[1.02] shadow-lg shadow-orange-500/25"
          >
            Start Free 7-Day Trial →
          </Link>

          {/* Auto-renewal disclaimer */}
          <p className="mt-4 text-xs text-zinc-500 text-center leading-relaxed">
            By continuing, you agree to start a free {TRIAL_DAYS}-day trial. A temporary authorization hold may appear on your card. After the trial, your subscription will auto-renew at ${isAnnual ? `${ANNUAL_PRICE} USD/year` : `${MONTHLY_PRICE} USD/month`} unless you cancel in Settings. Please see our{" "}
            <button onClick={() => setShowTerms(true)} className="text-zinc-400 underline hover:text-zinc-300">
              Subscription terms
            </button>
            ,{" "}
            <button onClick={() => setShowTerms(true)} className="text-zinc-400 underline hover:text-zinc-300">
              Refund policy
            </button>
            .
          </p>

          {/* Guarantee */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-zinc-400 text-sm">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Cancel anytime · No contracts</span>
            </div>
          </div>
        </div>
      </div>

      {/* PR-or-Free Guarantee */}
      <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-left">
            <h4 className="text-green-400 font-bold text-lg">The 90-Day Guarantee</h4>
            <p className="text-zinc-400 text-sm">Get stronger and faster in 90 days — or it's free.</p>
          </div>
        </div>
        <button
          onClick={() => setShowTerms(true)}
          className="text-green-400 text-sm underline hover:text-green-300 transition-colors"
        >
          View Terms & Conditions
        </button>
      </div>

      {/* Terms Modal */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
}
