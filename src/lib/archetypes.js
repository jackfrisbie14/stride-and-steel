// 4 Training Archetypes with Lift/Run/Recovery ratios
export const archetypes = {
  ironRunner: {
    key: "ironRunner",
    label: "The Iron Runner",
    description: "You prioritize running and use lifting to get faster. Speed and endurance are your foundation.",
    ratios: { lift: 35, run: 50, recovery: 15 },
  },
  steelStrider: {
    key: "steelStrider",
    label: "The Steel Strider",
    description: "You prioritize strength and use running for conditioning. The gym is your home turf.",
    ratios: { lift: 50, run: 35, recovery: 15 },
  },
  balancedAthlete: {
    key: "balancedAthlete",
    label: "The Balanced Athlete",
    description: "You thrive with equal focus on strength and endurance, building a well-rounded athletic foundation.",
    ratios: { lift: 40, run: 40, recovery: 20 },
  },
  enduranceMachine: {
    key: "enduranceMachine",
    label: "The Endurance Machine",
    description: "You're built for volume and distance. Long runs and high-rep training fuel your engine.",
    ratios: { lift: 25, run: 55, recovery: 20 },
  },
};

/**
 * Determine archetype from quiz answers using a points-based scoring system.
 * Quiz stores full strings with emojis, so we use .includes() for matching.
 *
 * @param {string[]} answers - Array of 10 quiz answer strings
 * @returns {{ key: string, label: string, description: string }}
 */
export function determineArchetype(answers) {
  const scores = {
    ironRunner: 0,
    steelStrider: 0,
    balancedAthlete: 0,
    enduranceMachine: 0,
  };

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return archetypes.balancedAthlete;
  }

  // Q1 (index 0) — Athlete type
  const q1 = (answers[0] || "").toLowerCase();
  if (q1.includes("runner")) scores.ironRunner += 3;
  else if (q1.includes("triathlete")) scores.enduranceMachine += 3;
  else if (q1.includes("lifter") || q1.includes("strength")) scores.steelStrider += 3;
  else if (q1.includes("hybrid") || q1.includes("both")) scores.balancedAthlete += 3;

  // Q2 (index 1) — Main goal
  const q2 = (answers[1] || "").toLowerCase();
  if (q2.includes("run faster") || q2.includes("faster runner")) scores.ironRunner += 3;
  else if (q2.includes("build strength") || q2.includes("stronger") || q2.includes("muscle")) scores.steelStrider += 3;
  else if (q2.includes("balance") || q2.includes("both")) scores.balancedAthlete += 3;
  else if (q2.includes("race") || q2.includes("compete")) {
    scores.enduranceMachine += 2;
    scores.ironRunner += 2;
  }

  // Q5 (index 4) — Biggest challenge
  const q5 = (answers[4] || "").toLowerCase();
  if (q5.includes("slow") || q5.includes("lifting")) scores.ironRunner += 2;
  else if (q5.includes("weak") || q5.includes("running")) scores.steelStrider += 2;
  else if (q5.includes("fatigue") || q5.includes("tired") || q5.includes("recovery")) scores.balancedAthlete += 2;

  // Q7 (index 6) — 12-week success vision
  const q7 = (answers[6] || "").toLowerCase();
  if (q7.includes("faster") || q7.includes("speed") || q7.includes("pr")) scores.ironRunner += 3;
  else if (q7.includes("strength") || q7.includes("stronger") || q7.includes("lift")) scores.steelStrider += 2;
  else if (q7.includes("consistent") || q7.includes("habit")) scores.balancedAthlete += 2;
  else if (q7.includes("athletic") || q7.includes("well-rounded") || q7.includes("overall")) scores.balancedAthlete += 3;

  // Q10 (index 9) — 12-week goal
  const q10 = (answers[9] || "").toLowerCase();
  if (q10.includes("5k") || q10.includes("10k") || q10.includes("faster")) scores.ironRunner += 3;
  else if (q10.includes("add lift") || q10.includes("lifting") || q10.includes("strength program")) scores.steelStrider += 3;
  else if (q10.includes("half marathon") || q10.includes("half")) {
    scores.ironRunner += 2;
    scores.enduranceMachine += 2;
  } else if (q10.includes("muscle") && q10.includes("mile")) scores.steelStrider += 2;
  else if (q10.includes("overall") || q10.includes("well-rounded") || q10.includes("balanced")) scores.balancedAthlete += 3;

  // Find the archetype with the highest score
  let maxKey = "balancedAthlete";
  let maxScore = scores.balancedAthlete;

  for (const [key, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxKey = key;
    }
  }

  return archetypes[maxKey];
}

/**
 * Parse training days from Q3 answer string.
 * Expects strings like "3 days", "4 days", "5 days", "6+ days"
 */
export function parseTrainingDays(answer) {
  if (!answer) return 5;
  const match = answer.match(/(\d+)/);
  if (match) {
    const days = parseInt(match[1], 10);
    return Math.max(3, Math.min(7, days));
  }
  return 5;
}

/**
 * Parse experience level from Q4 answer string.
 * Returns "beginner", "intermediate", or "advanced"
 */
export function parseExperience(answer) {
  if (!answer) return "intermediate";
  const lower = answer.toLowerCase();
  if (lower.includes("beginner") || lower.includes("new") || lower.includes("just starting")) return "beginner";
  if (lower.includes("advanced") || lower.includes("years") || lower.includes("experienced")) return "advanced";
  return "intermediate";
}
