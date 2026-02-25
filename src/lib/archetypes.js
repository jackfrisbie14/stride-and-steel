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

  // Q3 (index 2) — Biggest challenge (was Q5/index 4)
  const q3 = (answers[2] || "").toLowerCase();
  if (q3.includes("slow") || q3.includes("lifting")) scores.ironRunner += 2;
  else if (q3.includes("weak") || q3.includes("running")) scores.steelStrider += 2;
  else if (q3.includes("fatigue") || q3.includes("tired") || q3.includes("recovery")) scores.balancedAthlete += 2;

  // Q4 (index 3) — 12-week success vision (was Q7/index 6)
  const q4 = (answers[3] || "").toLowerCase();
  if (q4.includes("faster") || q4.includes("speed") || q4.includes("pr")) scores.ironRunner += 3;
  else if (q4.includes("strength") || q4.includes("stronger") || q4.includes("lift")) scores.steelStrider += 2;
  else if (q4.includes("consistent") || q4.includes("habit")) scores.balancedAthlete += 2;
  else if (q4.includes("athletic") || q4.includes("well-rounded") || q4.includes("overall")) scores.balancedAthlete += 3;

  // Q5 (index 4) — 12-week goal (was Q10/index 9)
  const q5 = (answers[4] || "").toLowerCase();
  if (q5.includes("5k") || q5.includes("10k") || q5.includes("faster")) scores.ironRunner += 3;
  else if (q5.includes("add lift") || q5.includes("lifting") || q5.includes("strength program")) scores.steelStrider += 3;
  else if (q5.includes("half marathon") || q5.includes("half")) {
    scores.ironRunner += 2;
    scores.enduranceMachine += 2;
  } else if (q5.includes("muscle") && q5.includes("mile")) scores.steelStrider += 2;
  else if (q5.includes("overall") || q5.includes("well-rounded") || q5.includes("balanced")) scores.balancedAthlete += 3;

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
