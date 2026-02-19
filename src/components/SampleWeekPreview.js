"use client";

import { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// Sample workout data with exercise tutorials (hybrid: lifting + running)
// ---------------------------------------------------------------------------
const SAMPLE_WORKOUTS = [
  {
    day: "Monday",
    type: "Lift",
    title: "Upper Body Push",
    icon: "\u{1F3CB}\u{FE0F}",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    duration: "50 min",
    exercises: [
      {
        name: "Barbell Bench Press",
        detail: "4 x 8",
        sets: 4,
        reps: 8,
        notes: "Flat bench, controlled tempo",
        tutorial: {
          category: "Chest",
          difficulty: "Intermediate",
          steps: [
            "Lie flat on the bench with feet firmly on the ground.",
            "Grip the bar slightly wider than shoulder width, unrack it.",
            "Lower the bar to mid-chest with control (2-3 second descent).",
            "Press the bar back up to full lockout, squeezing your chest.",
          ],
          tips: [
            "Retract your shoulder blades and keep them pinched throughout.",
            "Drive your feet into the floor for a stable base.",
            "Keep your wrists straight — the bar should sit on the heel of your palm.",
          ],
          mistakes: [
            "Bouncing the bar off your chest.",
            "Flaring elbows to 90 degrees (keep them at 45-75 degrees).",
            "Lifting your hips off the bench.",
          ],
        },
      },
      {
        name: "Overhead Press",
        detail: "3 x 10",
        sets: 3,
        reps: 10,
        notes: "Standing, strict form",
        tutorial: {
          category: "Shoulders",
          difficulty: "Intermediate",
          steps: [
            "Stand with feet shoulder-width apart, bar at collarbone height.",
            "Brace your core and press the bar straight overhead.",
            "Lock out at the top with the bar over midfoot.",
            "Lower with control back to the starting position.",
          ],
          tips: [
            "Squeeze your glutes to prevent lower back arching.",
            "Move your head back slightly as the bar passes your face.",
            "Full lockout at the top — don't stop short.",
          ],
          mistakes: [
            "Excessive lower back arch (use lighter weight and brace harder).",
            "Pressing the bar forward instead of straight up.",
            "Using leg drive (that's a push press, not strict press).",
          ],
        },
      },
      {
        name: "Incline Dumbbell Press",
        detail: "3 x 10",
        sets: 3,
        reps: 10,
        notes: "30-degree incline",
        tutorial: {
          category: "Chest",
          difficulty: "Intermediate",
          steps: [
            "Set the bench to about 30 degrees (not too steep).",
            "Hold dumbbells at chest level, palms facing forward.",
            "Press up until arms are extended, bringing dumbbells slightly together.",
            "Lower with control until upper arms are parallel to the floor.",
          ],
          tips: [
            "30 degrees targets upper chest without too much front delt takeover.",
            "Keep a slight arch in your upper back.",
            "Don't let the dumbbells drift too wide at the bottom.",
          ],
          mistakes: [
            "Setting the incline too steep (45+ degrees becomes a shoulder press).",
            "Letting dumbbells drift behind you at the bottom.",
            "Not going through full range of motion.",
          ],
        },
      },
      {
        name: "Lateral Raises",
        detail: "3 x 15",
        sets: 3,
        reps: 15,
        notes: "Light weight, slow negative",
        tutorial: {
          category: "Shoulders",
          difficulty: "Beginner",
          steps: [
            "Stand with dumbbells at your sides, slight bend in the elbows.",
            "Raise arms out to the sides until they're parallel with the floor.",
            "Pause briefly at the top.",
            "Lower slowly (3 seconds) back to the starting position.",
          ],
          tips: [
            "Lead with your elbows, not your hands.",
            "Go lighter than you think — form matters more than weight here.",
            "The slow negative is where the growth happens.",
          ],
          mistakes: [
            "Using momentum (swinging the weights up).",
            "Going too heavy and shrugging your traps.",
            "Raising above shoulder height (unnecessary stress on the joint).",
          ],
        },
      },
      {
        name: "Tricep Pushdowns",
        detail: "3 x 12",
        sets: 3,
        reps: 12,
        notes: "Cable, rope attachment",
        tutorial: {
          category: "Arms",
          difficulty: "Beginner",
          steps: [
            "Attach a rope to the high cable pulley.",
            "Grip the rope with palms facing each other, elbows at your sides.",
            "Push down until arms are fully extended, splitting the rope at the bottom.",
            "Return to the starting position with control — don't let the weight pull you.",
          ],
          tips: [
            "Keep your elbows pinned to your sides throughout.",
            "Spread the rope apart at the bottom for peak contraction.",
            "Stand slightly leaned forward for a better angle.",
          ],
          mistakes: [
            "Letting elbows flare forward (makes it a pressing movement).",
            "Using too much weight and swinging your body.",
            "Not fully extending at the bottom.",
          ],
        },
      },
      {
        name: "Face Pulls",
        detail: "3 x 15",
        sets: 3,
        reps: 15,
        notes: "Rear delt and rotator cuff health",
        tutorial: {
          category: "Shoulders / Back",
          difficulty: "Beginner",
          steps: [
            "Set a cable at face height with a rope attachment.",
            "Pull the rope toward your face, separating the ends.",
            "Squeeze your rear delts and rotate your hands outward at the end.",
            "Return to start with control.",
          ],
          tips: [
            "This is a health exercise — prioritize form over weight.",
            "Think about pulling your shoulder blades together.",
            "Great for posture and shoulder injury prevention.",
          ],
          mistakes: [
            "Going too heavy and turning it into a row.",
            "Not pulling far enough back.",
            "Using body momentum instead of rear delts.",
          ],
        },
      },
    ],
  },
  {
    day: "Tuesday",
    type: "Run",
    title: "Tempo Run",
    icon: "\u{1F3C3}",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    duration: "50 min",
    exercises: [
      {
        name: "Warm-up Jog",
        detail: "15 min",
        notes: "Easy pace, dynamic stretches at the end",
        tutorial: {
          category: "Warm-up",
          difficulty: "Beginner",
          steps: ["Start with a 10-minute easy jog.", "Transition into dynamic drills: high knees, butt kicks, leg swings.", "Do 4-6 strides (80% effort for 15-20 seconds each).", "You should feel warm and ready to push."],
          tips: ["The warm-up is especially important before tempo work.", "Strides help 'wake up' your fast-twitch muscles.", "Don't rush — 15 minutes is worth it."],
          mistakes: ["Cutting the warm-up short before tempo efforts.", "Skipping dynamic drills.", "Going too hard on the strides."],
        },
      },
      {
        name: "Tempo Effort",
        detail: "20 min",
        notes: "Comfortably hard — threshold pace",
        tutorial: {
          category: "Threshold",
          difficulty: "Intermediate",
          steps: ["Settle into your tempo pace — comfortably hard, not all-out.", "Maintain a steady effort for the full 20 minutes.", "You should be able to say short phrases but not hold a conversation.", "If you can't maintain pace, slow slightly rather than stopping."],
          tips: ["Tempo pace is roughly your half-marathon race pace.", "Focus on relaxed form — don't clench your fists or hunch your shoulders.", "This workout builds your lactate threshold — crucial for racing."],
          mistakes: ["Starting too fast and fading.", "Running tempo runs too frequently (1x per week is enough).", "Confusing tempo with interval pace — tempo is steady, not all-out."],
        },
      },
      {
        name: "Cool-down Jog",
        detail: "10 min",
        notes: "Easy pace",
        tutorial: {
          category: "Cool-down",
          difficulty: "Beginner",
          steps: ["Slow to a very easy jog after the tempo block.", "Maintain an easy shuffle for 10 minutes.", "Walk for the last 2 minutes.", "Stretch major muscle groups."],
          tips: ["Don't stop immediately after the tempo block.", "Let your heart rate come down gradually.", "Hydrate as soon as you finish."],
          mistakes: ["Stopping cold after the hard effort.", "Skipping the cool-down.", "Running the cool-down at tempo pace."],
        },
      },
      {
        name: "Foam Roll",
        detail: "5 min",
        notes: "Quads, calves, IT band",
        tutorial: {
          category: "Recovery",
          difficulty: "Beginner",
          steps: ["Place the roller under your quads and roll from hip to knee.", "Roll your calves from ankle to knee.", "Lie on your side and roll the IT band from hip to knee.", "Pause on tender spots for 15-20 seconds."],
          tips: ["Don't roll directly on joints or bones.", "Moderate pressure — it shouldn't be excruciating.", "Roll slowly, not fast."],
          mistakes: ["Rolling too fast.", "Applying too much pressure on sensitive areas.", "Only foam rolling after hard workouts (do it daily)."],
        },
      },
    ],
  },
  {
    day: "Wednesday",
    type: "Lift",
    title: "Lower Body",
    icon: "\u{1F3CB}\u{FE0F}",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    duration: "55 min",
    exercises: [
      {
        name: "Barbell Back Squat",
        detail: "4 x 6",
        sets: 4,
        reps: 6,
        notes: "Below parallel, brace core",
        tutorial: {
          category: "Legs",
          difficulty: "Intermediate",
          steps: [
            "Position the bar on your upper traps, step back from the rack.",
            "Feet shoulder-width apart, toes slightly turned out.",
            "Brace your core, sit back and down until hips are below knees.",
            "Drive through your whole foot to stand back up. Lock out at the top.",
          ],
          tips: [
            "Take a big breath and brace before each rep (valsalva maneuver).",
            "Push your knees out in line with your toes.",
            "Keep your chest up — don't let your torso collapse forward.",
          ],
          mistakes: [
            "Not hitting depth (hips should go below knee level).",
            "Letting knees cave inward on the way up.",
            "Rising hips first and turning it into a good morning.",
          ],
        },
      },
      {
        name: "Romanian Deadlift",
        detail: "3 x 10",
        sets: 3,
        reps: 10,
        notes: "Hinge at hips, slight knee bend",
        tutorial: {
          category: "Posterior Chain",
          difficulty: "Intermediate",
          steps: [
            "Hold the barbell at hip height with an overhand grip.",
            "Push your hips back, keeping the bar close to your legs.",
            "Lower until you feel a deep stretch in your hamstrings (just below the knee for most).",
            "Drive your hips forward to return to standing. Squeeze glutes at the top.",
          ],
          tips: [
            "Think 'push hips back' not 'bend forward.'",
            "The bar should stay within an inch of your legs the entire time.",
            "Keep a neutral spine — no rounding.",
          ],
          mistakes: [
            "Rounding the lower back (drop the weight if this happens).",
            "Bending the knees too much (it's a hip hinge, not a squat).",
            "Letting the bar drift away from the body.",
          ],
        },
      },
      {
        name: "Walking Lunges",
        detail: "3 x 12 each",
        sets: 3,
        reps: 12,
        notes: "Dumbbells, long stride",
        tutorial: {
          category: "Legs",
          difficulty: "Beginner",
          steps: [
            "Hold dumbbells at your sides, stand tall.",
            "Take a large step forward and lower until both knees are at 90 degrees.",
            "Push through the front heel and step the back foot forward into the next lunge.",
            "Alternate legs for 12 reps per side.",
          ],
          tips: [
            "A longer stride emphasizes glutes; shorter stride emphasizes quads.",
            "Keep your torso upright — don't lean forward.",
            "Great for single-leg strength and balance (important for runners).",
          ],
          mistakes: [
            "Taking steps that are too short.", "Letting the front knee cave inward.", "Rushing — control each rep.",
          ],
        },
      },
      {
        name: "Leg Curl",
        detail: "3 x 12",
        sets: 3,
        reps: 12,
        notes: "Machine, controlled eccentric",
        tutorial: {
          category: "Hamstrings",
          difficulty: "Beginner",
          steps: [
            "Adjust the machine so the pad sits just above your ankles.",
            "Curl the weight up by bending your knees fully.",
            "Squeeze at the top for a moment.",
            "Lower slowly (3 seconds) back to the starting position.",
          ],
          tips: [
            "Focus on the slow eccentric (lowering phase).",
            "Don't let the weight stack slam at the bottom.",
            "Point your toes to increase hamstring activation.",
          ],
          mistakes: [
            "Using momentum to swing the weight up.",
            "Lifting your hips off the pad.",
            "Going too heavy at the expense of range of motion.",
          ],
        },
      },
      {
        name: "Standing Calf Raises",
        detail: "4 x 15",
        sets: 4,
        reps: 15,
        notes: "Full range of motion, pause at top",
        tutorial: {
          category: "Calves",
          difficulty: "Beginner",
          steps: [
            "Stand on a calf raise machine or a step with the balls of your feet on the edge.",
            "Lower your heels as far as comfortable for a deep stretch.",
            "Rise up onto your toes as high as you can.",
            "Pause at the top for 1-2 seconds, then lower slowly.",
          ],
          tips: [
            "Full range of motion is key — stretch at the bottom, squeeze at the top.",
            "Go slow. Calves respond well to time under tension.",
            "Strong calves = fewer running injuries.",
          ],
          mistakes: [
            "Bouncing through reps without pausing.", "Only doing half reps (partial range).", "Neglecting calves entirely (runners need them most).",
          ],
        },
      },
    ],
  },
  {
    day: "Thursday",
    type: "Run",
    title: "Easy Run",
    icon: "\u{1F3C3}",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    duration: "40 min",
    exercises: [
      {
        name: "Easy Pace Run",
        detail: "40 min",
        notes: "Conversational pace — you should be able to hold a full sentence",
        tutorial: {
          category: "Base Building",
          difficulty: "Beginner",
          steps: ["Start at a relaxed pace — slower than you think.", "Maintain a pace where you could comfortably chat with a friend.", "If breathing gets heavy, slow down. No ego on easy days.", "Keep a consistent effort for the full 40 minutes."],
          tips: ["Easy runs build your aerobic engine — the foundation of all running.", "Heart rate should stay in zone 2 (roughly 60-70% of max HR).", "Most people run easy days too fast. Slow down."],
          mistakes: ["Running easy days too fast — the #1 mistake runners make.", "Comparing your easy pace to others.", "Skipping easy runs because they feel too slow to matter."],
        },
      },
      {
        name: "Hip Circles",
        detail: "1 min",
        notes: "10 each direction, each leg",
        tutorial: {
          category: "Mobility",
          difficulty: "Beginner",
          steps: ["Stand on one leg (hold a wall for balance).", "Lift the other knee to waist height.", "Make large circles with the knee — 10 forward, 10 backward.", "Switch legs and repeat."],
          tips: ["Go slow and controlled.", "Keep your standing leg slightly bent.", "Great for hip mobility and injury prevention."],
          mistakes: ["Rushing through the circles.", "Using momentum instead of control.", "Skipping this because it seems too easy."],
        },
      },
      {
        name: "Walking Lunges",
        detail: "2 min",
        notes: "Cool-down, 10 each leg",
        tutorial: {
          category: "Cool-down",
          difficulty: "Beginner",
          steps: ["Step forward into a lunge — front knee over ankle, back knee near ground.", "Push through front heel and step the back foot forward.", "Alternate legs for 10 reps each side.", "Keep your torso upright and core engaged."],
          tips: ["Focus on balance, not speed.", "Keep front knee tracking over your toes.", "Great for active recovery after a run."],
          mistakes: ["Letting front knee cave inward.", "Leaning too far forward.", "Taking steps that are too short."],
        },
      },
    ],
  },
  {
    day: "Saturday",
    type: "Run",
    title: "Long Run",
    icon: "\u{1F3C3}",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    duration: "90 min",
    exercises: [
      {
        name: "Easy Pace Run",
        detail: "80 min",
        notes: "Relaxed effort, build aerobic base",
        tutorial: {
          category: "Endurance",
          difficulty: "Intermediate",
          steps: ["Start conservatively — even slower than your normal easy pace.", "Settle into a relaxed rhythm by mile 2.", "Stay disciplined — the goal is time on feet, not speed.", "Take water/fuel every 30-40 minutes if needed."],
          tips: ["Long runs are the single most important workout for distance runners.", "Heart rate zone 2 — you should be able to talk comfortably.", "Plan your route with water access or carry a bottle."],
          mistakes: ["Starting too fast because you feel fresh.", "Not fueling on runs longer than 60 minutes.", "Running the long run at marathon pace throughout."],
        },
      },
      {
        name: "Marathon Pace Finish",
        detail: "10 min",
        notes: "Pick up to goal marathon pace for the final stretch",
        tutorial: {
          category: "Race Prep",
          difficulty: "Intermediate",
          steps: ["With 10 minutes remaining, gradually increase to marathon pace.", "Focus on maintaining good form as fatigue sets in.", "Practice the mental discipline of pushing when tired.", "Finish strong and transition to a walk."],
          tips: ["This teaches your body to run fast on tired legs — key for race day.", "Don't sprint — just a controlled increase to marathon effort.", "If you can't hold pace, that's useful data about your fitness."],
          mistakes: ["Going all-out — this is controlled, not a sprint.", "Skipping this because you're tired (that's the point).", "Forgetting to cool down after."],
        },
      },
      {
        name: "Walking Cool-down",
        detail: "5 min",
        notes: "Walk it out, hydrate",
        tutorial: {
          category: "Cool-down",
          difficulty: "Beginner",
          steps: ["Walk at an easy pace for 5 minutes.", "Focus on deep breathing.", "Sip water — don't gulp.", "Follow with static stretching."],
          tips: ["Walking after a long run helps prevent blood pooling.", "Start refueling within 30 minutes.", "Assess how the run went."],
          mistakes: ["Sitting down immediately.", "Not rehydrating.", "Skipping the walking cool-down."],
        },
      },
      {
        name: "Static Stretching",
        detail: "5 min",
        notes: "Quads, hamstrings, hip flexors, calves",
        tutorial: {
          category: "Stretching",
          difficulty: "Beginner",
          steps: ["Hold each stretch for 30-45 seconds. Don't bounce.", "Quad stretch: standing, pull heel to glute.", "Hamstring stretch: seated forward fold.", "Calf stretch: wall lean with straight back leg."],
          tips: ["Post-run is the best time for static stretching.", "Breathe deeply into each stretch.", "Hit hip flexors too — runners are chronically tight there."],
          mistakes: ["Bouncing or forcing the stretch.", "Only holding for 10 seconds.", "Skipping stretching because you're tired."],
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Rating labels
// ---------------------------------------------------------------------------
const ratingLabels = {
  preEnergyLevel: ["Exhausted", "Tired", "Okay", "Good", "Energized"],
  preSoreness: ["Very sore", "Sore", "Slight", "Fresh", "Great"],
  preMotivation: ["None", "Low", "Okay", "High", "Pumped"],
  difficulty: ["Too Easy", "Easy", "Just Right", "Hard", "Too Hard"],
  performance: ["Poor", "Below Avg", "Average", "Good", "Great"],
  enjoyment: ["Hated it", "Meh", "Okay", "Liked it", "Loved it"],
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RatingButton({ value, selected, onClick, label }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex-1 py-2 px-1 text-xs rounded-lg transition-all ${
        selected ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
      }`}
    >
      {label}
    </button>
  );
}

function RatingGroup({ label, name, value, onChange, labels }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <RatingButton key={num} value={num} selected={value === num} onClick={onChange} label={labels[num - 1]} />
        ))}
      </div>
    </div>
  );
}

function ExerciseDetailModal({ exercise, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const t = exercise.tutorial;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold">{exercise.name}</h2>
            <p className="text-sm text-zinc-500">{t.category} · {t.difficulty}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 text-xs">1</span>
              How To Perform
            </h3>
            <ol className="space-y-2">
              {t.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-800 text-zinc-500 text-xs flex items-center justify-center mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-500 text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </span>
              Form Tips
            </h3>
            <ul className="space-y-2">
              {t.tips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="flex-shrink-0 text-green-500 mt-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-500 text-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </span>
              Common Mistakes
            </h3>
            <ul className="space-y-2">
              {t.mistakes.map((m, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                  <span className="flex-shrink-0 text-red-500 mt-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreWorkoutModal({ workout, onClose, onSubmit }) {
  const [energy, setEnergy] = useState(null);
  const [soreness, setSoreness] = useState(null);
  const [motivation, setMotivation] = useState(null);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = "unset"; }; }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <div><p className="text-sm text-zinc-500">{workout.day}</p><h2 className="text-lg font-bold">{workout.title}</h2></div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="text-center"><h3 className="text-xl font-semibold">Pre-Workout Check-in</h3><p className="text-sm text-zinc-400 mt-1">How are you feeling before this workout?</p></div>
          <RatingGroup label="Energy Level" name="energy" value={energy} onChange={setEnergy} labels={ratingLabels.preEnergyLevel} />
          <RatingGroup label="Muscle Soreness" name="soreness" value={soreness} onChange={setSoreness} labels={ratingLabels.preSoreness} />
          <RatingGroup label="Motivation" name="motivation" value={motivation} onChange={setMotivation} labels={ratingLabels.preMotivation} />
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors">Skip Workout</button>
            <button onClick={() => { if (energy && soreness && motivation) onSubmit({ energy, soreness, motivation }); }} disabled={!energy || !soreness || !motivation} className="flex-1 py-3 rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Start Workout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostWorkoutModal({ workout, onClose, onSubmit }) {
  const [difficulty, setDifficulty] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [enjoyment, setEnjoyment] = useState(null);
  const [notes, setNotes] = useState("");

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = "unset"; }; }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
          <div><p className="text-sm text-zinc-500">{workout.day}</p><h2 className="text-lg font-bold">{workout.title}</h2></div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="text-center"><h3 className="text-xl font-semibold">Post-Workout Feedback</h3><p className="text-sm text-zinc-400 mt-1">How did the workout go?</p></div>
          <RatingGroup label="Difficulty" name="difficulty" value={difficulty} onChange={setDifficulty} labels={ratingLabels.difficulty} />
          <RatingGroup label="Performance" name="performance" value={performance} onChange={setPerformance} labels={ratingLabels.performance} />
          <RatingGroup label="Enjoyment" name="enjoyment" value={enjoyment} onChange={setEnjoyment} labels={ratingLabels.enjoyment} />
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any thoughts about today's workout..." className="w-full h-20 rounded-lg bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors">Didn&apos;t Finish</button>
            <button onClick={() => { if (difficulty && performance && enjoyment) onSubmit({ difficulty, performance, enjoyment, notes }); }} disabled={!difficulty || !performance || !enjoyment} className="flex-1 py-3 rounded-xl bg-green-500 font-semibold text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Complete!</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function SampleWeekPreview() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [completedSets, setCompletedSets] = useState({});
  const [completedExercises, setCompletedExercises] = useState({});
  const [workoutStates, setWorkoutStates] = useState({});
  const [preModal, setPreModal] = useState(null);
  const [postModal, setPostModal] = useState(null);

  const toggleSet = (workoutIdx, exerciseIdx, setIdx) => {
    const key = `${workoutIdx}-${exerciseIdx}-${setIdx}`;
    setCompletedSets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExercise = (workoutIdx, exerciseIdx) => {
    const key = `${workoutIdx}-${exerciseIdx}`;
    setCompletedExercises((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getWorkoutState = (idx) => workoutStates[idx] || "idle";

  const exerciseDoneCount = (workoutIdx, workout) => {
    return workout.exercises.filter((ex, j) => {
      if (ex.sets) {
        // Lifting: all sets must be checked
        return Array.from({ length: ex.sets }, (_, s) => completedSets[`${workoutIdx}-${j}-${s}`]).every(Boolean);
      }
      return !!completedExercises[`${workoutIdx}-${j}`];
    }).length;
  };

  return (
    <>
      <div className="space-y-3">
        {SAMPLE_WORKOUTS.map((w, i) => {
          const state = getWorkoutState(i);
          const done = exerciseDoneCount(i, w);
          const total = w.exercises.length;

          return (
            <div
              key={i}
              className={`rounded-xl border bg-zinc-800/30 overflow-hidden transition-colors ${
                state === "completed" ? "border-green-500/30" : state === "in_progress" ? "border-yellow-500/30" : "border-zinc-800"
              }`}
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className="w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-zinc-800/50"
              >
                <div className="w-20 flex-shrink-0">
                  <p className="text-xs text-zinc-500">{w.day}</p>
                  <span className={`text-xs font-medium ${w.color} ${w.bg} px-2 py-0.5 rounded-full`}>{w.type}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm">{w.title}</p>
                  <p className="text-xs text-zinc-500">{w.duration} · {total} exercises</p>
                </div>
                <div className="flex items-center gap-2">
                  {state === "completed" && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Done
                    </span>
                  )}
                  {state === "in_progress" && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                      {done}/{total}
                    </span>
                  )}
                  <svg className={`w-4 h-4 text-zinc-500 flex-shrink-0 transition-transform duration-200 ${expandedIndex === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedIndex === i && (
                <div className="border-t border-zinc-800">
                  <div className="p-4 space-y-2">
                    {w.exercises.map((ex, j) => {
                      const hasTracking = state === "in_progress";
                      const hasSets = !!ex.sets;
                      const exerciseComplete = hasSets
                        ? Array.from({ length: ex.sets }, (_, s) => completedSets[`${i}-${j}-${s}`]).every(Boolean)
                        : !!completedExercises[`${i}-${j}`];

                      return (
                        <div key={j} className={`rounded-lg p-3 transition-colors ${exerciseComplete ? "bg-green-500/5" : "hover:bg-zinc-800/30"}`}>
                          {/* Exercise header */}
                          <div className="flex items-center gap-3">
                            {hasTracking && !hasSets && (
                              <button
                                onClick={() => toggleExercise(i, j)}
                                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                  exerciseComplete ? "bg-green-500 border-green-500" : "border-zinc-600 hover:border-zinc-400"
                                }`}
                              >
                                {exerciseComplete && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </button>
                            )}
                            <button onClick={() => setSelectedExercise(ex)} className="flex-1 min-w-0 text-left group">
                              <div className="flex items-baseline justify-between gap-2">
                                <p className={`text-sm font-medium group-hover:text-orange-400 transition-colors flex items-center gap-1.5 ${exerciseComplete ? "line-through text-zinc-500" : "text-white"}`}>
                                  {ex.name}
                                  <svg className="w-3.5 h-3.5 text-zinc-600 group-hover:text-orange-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </p>
                                <span className={`text-xs font-medium whitespace-nowrap ${exerciseComplete ? "text-zinc-600" : w.color}`}>{ex.detail}</span>
                              </div>
                              <p className={`text-xs mt-0.5 ${exerciseComplete ? "text-zinc-600" : "text-zinc-500"}`}>{ex.notes}</p>
                            </button>
                          </div>

                          {/* Set tracking for lifting exercises */}
                          {hasTracking && hasSets && (
                            <div className="mt-2 ml-0 flex gap-1.5 flex-wrap">
                              {Array.from({ length: ex.sets }, (_, s) => {
                                const setDone = !!completedSets[`${i}-${j}-${s}`];
                                return (
                                  <button
                                    key={s}
                                    onClick={() => toggleSet(i, j, s)}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                      setDone
                                        ? "bg-green-500/20 border-green-500/30 text-green-400"
                                        : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                                    }`}
                                  >
                                    {setDone ? (
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                      <span className="w-3 h-3 rounded-sm border border-zinc-600" />
                                    )}
                                    Set {s + 1}: {ex.reps} reps
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-zinc-800 p-4">
                    {state === "idle" && (
                      <button onClick={() => setPreModal(i)} className="w-full py-3 rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600 transition-colors">Start Workout</button>
                    )}
                    {state === "in_progress" && (
                      <button onClick={() => setPostModal(i)} className="w-full py-3 rounded-xl bg-green-500 font-semibold text-white hover:bg-green-600 transition-colors">Complete Workout</button>
                    )}
                    {state === "completed" && (
                      <div className="bg-zinc-800/30 rounded-xl p-3 text-center">
                        <p className="text-sm text-green-400 font-medium">Workout completed</p>
                        <p className="text-xs text-zinc-500 mt-1">Great work! Your feedback has been recorded.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedExercise && <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
      {preModal !== null && (
        <PreWorkoutModal
          workout={SAMPLE_WORKOUTS[preModal]}
          onClose={() => setPreModal(null)}
          onSubmit={() => { setWorkoutStates((prev) => ({ ...prev, [preModal]: "in_progress" })); setPreModal(null); }}
        />
      )}
      {postModal !== null && (
        <PostWorkoutModal
          workout={SAMPLE_WORKOUTS[postModal]}
          onClose={() => setPostModal(null)}
          onSubmit={() => {
            setWorkoutStates((prev) => ({ ...prev, [postModal]: "completed" }));
            const exUpdates = {};
            const setUpdates = {};
            SAMPLE_WORKOUTS[postModal].exercises.forEach((ex, j) => {
              exUpdates[`${postModal}-${j}`] = true;
              if (ex.sets) { for (let s = 0; s < ex.sets; s++) { setUpdates[`${postModal}-${j}-${s}`] = true; } }
            });
            setCompletedExercises((prev) => ({ ...prev, ...exUpdates }));
            setCompletedSets((prev) => ({ ...prev, ...setUpdates }));
            setPostModal(null);
          }}
        />
      )}
    </>
  );
}
