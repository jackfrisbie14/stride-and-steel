"use client";

import { useState } from "react";

export default function SubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Failed to open billing portal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleManageSubscription}
      disabled={loading}
      className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
    >
      {loading ? "Loading..." : "Manage Subscription"}
    </button>
  );
}
