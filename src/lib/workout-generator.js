import { archetypes } from "./archetypes";
import { getAnthropicClient } from "./anthropic";

// ─── Workout Template Pools ────────────────────────────────────────────

const liftTemplates = {
  upperBody: {
    beginner: {
      title: "Upper Body Foundations",
      exercises: [
        { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Bicep Curls", sets: 2, reps: "12-15", rest: "60 sec" },
        { name: "Tricep Pushdowns", sets: 2, reps: "12-15", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Upper Body Strength",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "6-8", rest: "2-3 min" },
        { name: "Bent Over Rows", sets: 4, reps: "8-10", rest: "2 min" },
        { name: "Overhead Press", sets: 3, reps: "8-10", rest: "2 min" },
        { name: "Pull-ups or Lat Pulldown", sets: 3, reps: "8-12", rest: "90 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Bicep Curls", sets: 2, reps: "12-15", rest: "60 sec" },
        { name: "Tricep Pushdowns", sets: 2, reps: "12-15", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Upper Body Power",
      exercises: [
        { name: "Bench Press", sets: 5, reps: "3-5", rest: "3 min" },
        { name: "Weighted Pull-ups", sets: 4, reps: "5-8", rest: "2-3 min" },
        { name: "Overhead Press", sets: 4, reps: "5-8", rest: "2-3 min" },
        { name: "Pendlay Rows", sets: 4, reps: "6-8", rest: "2 min" },
        { name: "Dips", sets: 3, reps: "8-12", rest: "90 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60 sec" },
      ],
    },
  },
  lowerBody: {
    beginner: {
      title: "Lower Body Foundations",
      exercises: [
        { name: "Goblet Squats", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "90 sec" },
        { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Calf Raises", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Plank Hold", sets: 3, reps: "30-45 sec", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Lower Body Strength",
      exercises: [
        { name: "Barbell Back Squat", sets: 4, reps: "6-8", rest: "3 min" },
        { name: "Romanian Deadlift", sets: 4, reps: "8-10", rest: "2-3 min" },
        { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "2 min" },
        { name: "Leg Press", sets: 3, reps: "10-12", rest: "2 min" },
        { name: "Calf Raises", sets: 4, reps: "12-15", rest: "60 sec" },
        { name: "Plank Hold", sets: 3, reps: "45-60 sec", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Lower Body Power",
      exercises: [
        { name: "Barbell Back Squat", sets: 5, reps: "3-5", rest: "3-4 min" },
        { name: "Deadlift", sets: 4, reps: "3-5", rest: "3-4 min" },
        { name: "Bulgarian Split Squats", sets: 3, reps: "8 each leg", rest: "2 min" },
        { name: "Hip Thrusts", sets: 4, reps: "8-10", rest: "2 min" },
        { name: "Nordic Hamstring Curls", sets: 3, reps: "6-8", rest: "90 sec" },
        { name: "Calf Raises", sets: 4, reps: "12-15", rest: "60 sec" },
      ],
    },
  },
  fullBody: {
    beginner: {
      title: "Full Body Circuit",
      exercises: [
        { name: "Kettlebell Swings", sets: 3, reps: "12", rest: "60 sec" },
        { name: "Push-ups", sets: 3, reps: "10-15", rest: "45 sec" },
        { name: "Goblet Squats", sets: 3, reps: "10", rest: "60 sec" },
        { name: "Dumbbell Rows", sets: 3, reps: "10 each arm", rest: "45 sec" },
        { name: "Step-ups", sets: 3, reps: "10 each leg", rest: "60 sec" },
        { name: "Dead Bug", sets: 3, reps: "10 each side", rest: "45 sec" },
      ],
    },
    intermediate: {
      title: "Full Body Circuit",
      exercises: [
        { name: "Kettlebell Swings", sets: 3, reps: "15", rest: "60 sec" },
        { name: "Push-ups", sets: 3, reps: "15-20", rest: "45 sec" },
        { name: "Goblet Squats", sets: 3, reps: "12", rest: "60 sec" },
        { name: "Dumbbell Rows", sets: 3, reps: "10 each arm", rest: "45 sec" },
        { name: "Step-ups", sets: 3, reps: "10 each leg", rest: "60 sec" },
        { name: "Dead Bug", sets: 3, reps: "10 each side", rest: "45 sec" },
        { name: "Farmer's Carry", sets: 3, reps: "40m", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Full Body Power Circuit",
      exercises: [
        { name: "Power Clean", sets: 4, reps: "5", rest: "2 min" },
        { name: "Weighted Push-ups", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Front Squats", sets: 4, reps: "8", rest: "2 min" },
        { name: "Weighted Pull-ups", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Box Jumps", sets: 3, reps: "8", rest: "90 sec" },
        { name: "Ab Wheel Rollouts", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Farmer's Carry", sets: 3, reps: "60m", rest: "60 sec" },
      ],
    },
  },
  // ─── PPL Templates ──────────────────────────────────────────────────
  push: {
    beginner: {
      title: "Push Day",
      exercises: [
        { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Tricep Pushdowns", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Overhead Tricep Extension", sets: 2, reps: "12-15", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Push Day",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "6-8", rest: "2-3 min" },
        { name: "Overhead Press", sets: 4, reps: "8-10", rest: "2 min" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Tricep Pushdowns", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Overhead Tricep Extension", sets: 3, reps: "10-12", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Push Day",
      exercises: [
        { name: "Bench Press", sets: 5, reps: "3-5", rest: "3 min" },
        { name: "Overhead Press", sets: 4, reps: "5-8", rest: "2-3 min" },
        { name: "Incline Dumbbell Press", sets: 4, reps: "8-10", rest: "90 sec" },
        { name: "Dips", sets: 3, reps: "8-12", rest: "90 sec" },
        { name: "Lateral Raises", sets: 4, reps: "12-15", rest: "60 sec" },
        { name: "Skull Crushers", sets: 3, reps: "10-12", rest: "60 sec" },
      ],
    },
  },
  pull: {
    beginner: {
      title: "Pull Day",
      exercises: [
        { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Dumbbell Rows", sets: 3, reps: "10 each arm", rest: "90 sec" },
        { name: "Bicep Curls", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Hammer Curls", sets: 2, reps: "12-15", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Pull Day",
      exercises: [
        { name: "Pull-ups", sets: 4, reps: "6-10", rest: "2 min" },
        { name: "Bent Over Rows", sets: 4, reps: "8-10", rest: "2 min" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Cable Rows", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Barbell Curls", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Pull Day",
      exercises: [
        { name: "Weighted Pull-ups", sets: 4, reps: "5-8", rest: "2-3 min" },
        { name: "Pendlay Rows", sets: 4, reps: "6-8", rest: "2 min" },
        { name: "T-Bar Rows", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Barbell Curls", sets: 3, reps: "8-10", rest: "60 sec" },
        { name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60 sec" },
      ],
    },
  },
  legs: {
    beginner: {
      title: "Leg Day",
      exercises: [
        { name: "Goblet Squats", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "90 sec" },
        { name: "Leg Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Calf Raises", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Plank Hold", sets: 3, reps: "30-45 sec", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Leg Day",
      exercises: [
        { name: "Barbell Back Squat", sets: 4, reps: "6-8", rest: "3 min" },
        { name: "Romanian Deadlift", sets: 4, reps: "8-10", rest: "2-3 min" },
        { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "2 min" },
        { name: "Leg Curl", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Calf Raises", sets: 4, reps: "12-15", rest: "60 sec" },
        { name: "Plank Hold", sets: 3, reps: "45-60 sec", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Leg Day",
      exercises: [
        { name: "Barbell Back Squat", sets: 5, reps: "3-5", rest: "3-4 min" },
        { name: "Deadlift", sets: 4, reps: "3-5", rest: "3-4 min" },
        { name: "Bulgarian Split Squats", sets: 3, reps: "8 each leg", rest: "2 min" },
        { name: "Hip Thrusts", sets: 4, reps: "8-10", rest: "2 min" },
        { name: "Nordic Hamstring Curls", sets: 3, reps: "6-8", rest: "90 sec" },
        { name: "Calf Raises", sets: 4, reps: "12-15", rest: "60 sec" },
      ],
    },
  },
  // ─── Arnold Split Templates ─────────────────────────────────────────
  chestBack: {
    beginner: {
      title: "Chest & Back",
      exercises: [
        { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Cable Flyes", sets: 2, reps: "12-15", rest: "60 sec" },
        { name: "Face Pulls", sets: 2, reps: "15-20", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Chest & Back",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "6-8", rest: "2-3 min" },
        { name: "Pull-ups", sets: 4, reps: "6-10", rest: "2 min" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Bent Over Rows", sets: 4, reps: "8-10", rest: "2 min" },
        { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Chest & Back",
      exercises: [
        { name: "Bench Press", sets: 5, reps: "3-5", rest: "3 min" },
        { name: "Weighted Pull-ups", sets: 4, reps: "5-8", rest: "2-3 min" },
        { name: "Incline Barbell Press", sets: 4, reps: "6-8", rest: "2 min" },
        { name: "Pendlay Rows", sets: 4, reps: "6-8", rest: "2 min" },
        { name: "Dips", sets: 3, reps: "8-12", rest: "90 sec" },
        { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
      ],
    },
  },
  shouldersArms: {
    beginner: {
      title: "Shoulders & Arms",
      exercises: [
        { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Bicep Curls", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Tricep Pushdowns", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Hammer Curls", sets: 2, reps: "12-15", rest: "60 sec" },
        { name: "Overhead Tricep Extension", sets: 2, reps: "12-15", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Shoulders & Arms",
      exercises: [
        { name: "Overhead Press", sets: 4, reps: "8-10", rest: "2 min" },
        { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Rear Delt Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Barbell Curls", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Skull Crushers", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Hammer Curls", sets: 2, reps: "10-12", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Shoulders & Arms",
      exercises: [
        { name: "Overhead Press", sets: 4, reps: "5-8", rest: "2-3 min" },
        { name: "Lateral Raises", sets: 4, reps: "12-15", rest: "60 sec" },
        { name: "Rear Delt Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Barbell Curls", sets: 4, reps: "8-10", rest: "60 sec" },
        { name: "Close-Grip Bench Press", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60 sec" },
      ],
    },
  },
  // ─── Bro Split Templates ───────────────────────────────────────────
  chest: {
    beginner: {
      title: "Chest Day",
      exercises: [
        { name: "Dumbbell Bench Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Push-ups", sets: 3, reps: "10-15", rest: "60 sec" },
        { name: "Dumbbell Pullover", sets: 2, reps: "12-15", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Chest Day",
      exercises: [
        { name: "Bench Press", sets: 4, reps: "6-8", rest: "2-3 min" },
        { name: "Incline Dumbbell Press", sets: 4, reps: "8-10", rest: "90 sec" },
        { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Dips", sets: 3, reps: "8-12", rest: "90 sec" },
        { name: "Dumbbell Pullover", sets: 3, reps: "10-12", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Chest Day",
      exercises: [
        { name: "Bench Press", sets: 5, reps: "3-5", rest: "3 min" },
        { name: "Incline Barbell Press", sets: 4, reps: "6-8", rest: "2-3 min" },
        { name: "Weighted Dips", sets: 3, reps: "8-10", rest: "2 min" },
        { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Dumbbell Pullover", sets: 3, reps: "10-12", rest: "60 sec" },
      ],
    },
  },
  back: {
    beginner: {
      title: "Back Day",
      exercises: [
        { name: "Lat Pulldown", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Seated Cable Rows", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Dumbbell Rows", sets: 3, reps: "10 each arm", rest: "90 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Back Extension", sets: 2, reps: "12-15", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Back Day",
      exercises: [
        { name: "Pull-ups", sets: 4, reps: "6-10", rest: "2 min" },
        { name: "Bent Over Rows", sets: 4, reps: "8-10", rest: "2 min" },
        { name: "Cable Rows", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Back Extension", sets: 3, reps: "12-15", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Back Day",
      exercises: [
        { name: "Weighted Pull-ups", sets: 4, reps: "5-8", rest: "2-3 min" },
        { name: "Pendlay Rows", sets: 4, reps: "6-8", rest: "2 min" },
        { name: "T-Bar Rows", sets: 3, reps: "8-10", rest: "90 sec" },
        { name: "Cable Rows", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
      ],
    },
  },
  shoulders: {
    beginner: {
      title: "Shoulder Day",
      exercises: [
        { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", rest: "90 sec" },
        { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Front Raises", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Shrugs", sets: 2, reps: "12-15", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Shoulder Day",
      exercises: [
        { name: "Overhead Press", sets: 4, reps: "8-10", rest: "2 min" },
        { name: "Lateral Raises", sets: 4, reps: "12-15", rest: "60 sec" },
        { name: "Rear Delt Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: "60 sec" },
        { name: "Shrugs", sets: 3, reps: "10-12", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Shoulder Day",
      exercises: [
        { name: "Overhead Press", sets: 5, reps: "5-8", rest: "2-3 min" },
        { name: "Arnold Press", sets: 4, reps: "8-10", rest: "90 sec" },
        { name: "Lateral Raises", sets: 4, reps: "12-15", rest: "60 sec" },
        { name: "Rear Delt Flyes", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Shrugs", sets: 4, reps: "10-12", rest: "60 sec" },
      ],
    },
  },
  arms: {
    beginner: {
      title: "Arms Day",
      exercises: [
        { name: "Bicep Curls", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Tricep Pushdowns", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Hammer Curls", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Overhead Tricep Extension", sets: 3, reps: "12-15", rest: "60 sec" },
        { name: "Concentration Curls", sets: 2, reps: "12-15", rest: "60 sec" },
      ],
    },
    intermediate: {
      title: "Arms Day",
      exercises: [
        { name: "Barbell Curls", sets: 4, reps: "8-10", rest: "60 sec" },
        { name: "Skull Crushers", sets: 4, reps: "8-10", rest: "60 sec" },
        { name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Tricep Pushdowns", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Incline Dumbbell Curls", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Overhead Tricep Extension", sets: 3, reps: "10-12", rest: "60 sec" },
      ],
    },
    advanced: {
      title: "Arms Day",
      exercises: [
        { name: "Barbell Curls", sets: 4, reps: "6-8", rest: "90 sec" },
        { name: "Close-Grip Bench Press", sets: 4, reps: "6-8", rest: "90 sec" },
        { name: "Preacher Curls", sets: 3, reps: "8-10", rest: "60 sec" },
        { name: "Skull Crushers", sets: 3, reps: "8-10", rest: "60 sec" },
        { name: "Hammer Curls", sets: 3, reps: "10-12", rest: "60 sec" },
        { name: "Tricep Kickbacks", sets: 3, reps: "12-15", rest: "60 sec" },
      ],
    },
  },
};

// ─── Split Category Rotations ─────────────────────────────────────────

const splitRotations = {
  ppl: ["push", "pull", "legs"],
  arnold: ["chestBack", "shouldersArms", "legs"],
  bro_split: ["chest", "back", "shoulders", "arms", "legs"],
  upper_lower: ["upperBody", "lowerBody"],
  full_body: ["fullBody"],
};

const runTemplates = {
  easy: {
    beginner: {
      title: "Easy Run",
      exercises: [
        { name: "Warm-up Walk", duration: "5 min", pace: "Easy" },
        { name: "Easy Run", duration: "20 min", pace: "Conversational pace (Zone 2)" },
        { name: "Cool-down Walk", duration: "5 min", pace: "Easy" },
        { name: "Post-Run Stretching", duration: "10 min", notes: "Focus on hips, quads, calves" },
      ],
    },
    intermediate: {
      title: "Easy Run",
      exercises: [
        { name: "Warm-up Walk", duration: "5 min", pace: "Easy" },
        { name: "Easy Run", duration: "30 min", pace: "Conversational pace (Zone 2)" },
        { name: "Cool-down Walk", duration: "5 min", pace: "Easy" },
        { name: "Post-Run Stretching", duration: "10 min", notes: "Focus on hips, quads, calves" },
      ],
    },
    advanced: {
      title: "Easy Run",
      exercises: [
        { name: "Warm-up Jog", duration: "5 min", pace: "Easy" },
        { name: "Easy Run", duration: "40 min", pace: "Conversational pace (Zone 2)" },
        { name: "Cool-down Jog", duration: "5 min", pace: "Easy" },
        { name: "Post-Run Stretching", duration: "10 min", notes: "Focus on hips, quads, calves" },
      ],
    },
  },
  tempo: {
    beginner: {
      title: "Tempo Run",
      exercises: [
        { name: "Warm-up Jog", duration: "10 min", pace: "Easy" },
        { name: "Tempo Run", duration: "12 min", pace: "Comfortably hard (Zone 3)" },
        { name: "Cool-down Jog", duration: "8 min", pace: "Easy" },
        { name: "Dynamic Stretching", duration: "5 min", notes: "Leg swings, hip circles" },
      ],
    },
    intermediate: {
      title: "Tempo Run",
      exercises: [
        { name: "Warm-up Jog", duration: "10 min", pace: "Easy" },
        { name: "Tempo Run", duration: "20 min", pace: "Comfortably hard (Zone 3-4)" },
        { name: "Cool-down Jog", duration: "10 min", pace: "Easy" },
        { name: "Dynamic Stretching", duration: "5 min", notes: "Leg swings, hip circles" },
      ],
    },
    advanced: {
      title: "Tempo Run",
      exercises: [
        { name: "Warm-up Jog", duration: "10 min", pace: "Easy" },
        { name: "Tempo Run", duration: "30 min", pace: "Lactate threshold (Zone 4)" },
        { name: "Cool-down Jog", duration: "10 min", pace: "Easy" },
        { name: "Dynamic Stretching", duration: "5 min", notes: "Leg swings, hip circles" },
      ],
    },
  },
  long: {
    beginner: {
      title: "Long Run",
      exercises: [
        { name: "Warm-up Walk", duration: "5 min", pace: "Easy" },
        { name: "Long Run", duration: "30-40 min", pace: "Easy/Conversational (Zone 2)" },
        { name: "Cool-down Walk", duration: "5 min", pace: "Easy" },
        { name: "Foam Rolling", duration: "15 min", notes: "IT band, quads, calves, glutes" },
      ],
    },
    intermediate: {
      title: "Long Run",
      exercises: [
        { name: "Warm-up Walk", duration: "5 min", pace: "Easy" },
        { name: "Long Run", duration: "45-60 min", pace: "Easy/Conversational (Zone 2)" },
        { name: "Cool-down Walk", duration: "5 min", pace: "Easy" },
        { name: "Foam Rolling", duration: "15 min", notes: "IT band, quads, calves, glutes" },
      ],
    },
    advanced: {
      title: "Long Run",
      exercises: [
        { name: "Warm-up Jog", duration: "10 min", pace: "Easy" },
        { name: "Long Run", duration: "60-90 min", pace: "Easy/Conversational (Zone 2)" },
        { name: "Cool-down Jog", duration: "5 min", pace: "Easy" },
        { name: "Foam Rolling", duration: "15 min", notes: "IT band, quads, calves, glutes" },
      ],
    },
  },
  intervals: {
    beginner: {
      title: "Interval Run",
      exercises: [
        { name: "Warm-up Jog", duration: "10 min", pace: "Easy" },
        { name: "Intervals", duration: "6 × 1 min hard / 2 min easy", pace: "Zone 4-5 / Zone 1" },
        { name: "Cool-down Jog", duration: "10 min", pace: "Easy" },
        { name: "Stretching", duration: "5 min", notes: "Full body" },
      ],
    },
    intermediate: {
      title: "Interval Run",
      exercises: [
        { name: "Warm-up Jog", duration: "10 min", pace: "Easy" },
        { name: "Intervals", duration: "8 × 400m", pace: "5K pace with 90 sec jog rest" },
        { name: "Cool-down Jog", duration: "10 min", pace: "Easy" },
        { name: "Stretching", duration: "5 min", notes: "Full body" },
      ],
    },
    advanced: {
      title: "Interval Run",
      exercises: [
        { name: "Warm-up Jog", duration: "15 min", pace: "Easy" },
        { name: "Intervals", duration: "10 × 400m", pace: "Sub-5K pace with 60 sec jog rest" },
        { name: "Cool-down Jog", duration: "10 min", pace: "Easy" },
        { name: "Strides", duration: "4 × 100m", pace: "Fast & relaxed" },
      ],
    },
  },
};

const recoveryTemplate = {
  title: "Active Recovery & Mobility",
  exercises: [
    { name: "Light Walk or Easy Bike", duration: "20-30 min", pace: "Very easy" },
    { name: "Hip Mobility Flow", duration: "10 min", notes: "90/90 stretches, pigeon pose" },
    { name: "Upper Body Stretching", duration: "10 min", notes: "Chest, shoulders, lats" },
    { name: "Foam Rolling", duration: "10 min", notes: "Full body" },
    { name: "Deep Breathing", duration: "5 min", notes: "Box breathing or meditation" },
  ],
};

// ─── Day Names ─────────────────────────────────────────────────────────

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ─── Day Allocation ────────────────────────────────────────────────────

function allocateDayTypes(trainingDays, ratios) {
  const { lift, run, recovery } = ratios;
  const total = lift + run + recovery;

  // Calculate raw counts
  let liftCount = Math.round((lift / total) * trainingDays);
  let runCount = Math.round((run / total) * trainingDays);
  let recoveryCount = Math.max(1, Math.round((recovery / total) * trainingDays));

  // Ensure at least 1 of each main type
  liftCount = Math.max(1, liftCount);
  runCount = Math.max(1, runCount);

  // Adjust to match total
  let currentTotal = liftCount + runCount + recoveryCount;
  while (currentTotal > trainingDays) {
    if (recoveryCount > 1) recoveryCount--;
    else if (liftCount > runCount) liftCount--;
    else runCount--;
    currentTotal = liftCount + runCount + recoveryCount;
  }
  while (currentTotal < trainingDays) {
    // Add to whichever has the highest ratio
    if (lift >= run) liftCount++;
    else runCount++;
    currentTotal = liftCount + runCount + recoveryCount;
  }

  return { liftCount, runCount, recoveryCount };
}

// ─── Schedule Builder ──────────────────────────────────────────────────

function buildSchedule(liftCount, runCount, recoveryCount, experience, liftingSplit) {
  const workouts = [];

  // Select lift templates: use split rotation or default upper/lower/full body
  const liftTypes = (liftingSplit && splitRotations[liftingSplit]) || ["upperBody", "lowerBody", "fullBody"];
  const liftWorkouts = [];
  for (let i = 0; i < liftCount; i++) {
    const liftType = liftTypes[i % liftTypes.length];
    const template = liftTemplates[liftType][experience];
    liftWorkouts.push({ type: "Lift", ...template });
  }

  // Select run templates: prioritize variety
  const runTypes = ["easy", "tempo", "long", "intervals"];
  const runWorkouts = [];
  for (let i = 0; i < runCount; i++) {
    const runType = runTypes[i % runTypes.length];
    const template = runTemplates[runType][experience];
    runWorkouts.push({ type: "Run", ...template });
  }

  // Recovery workouts
  const recoveryWorkouts = [];
  for (let i = 0; i < recoveryCount; i++) {
    recoveryWorkouts.push({ type: "Recovery", ...recoveryTemplate });
  }

  // Arrange: alternate lift/run, avoid back-to-back same-muscle lifts
  // Place long run on Saturday (or last run day), recovery on Sunday (or last day)
  const totalDays = liftCount + runCount + recoveryCount;
  const schedule = new Array(totalDays);

  // Place recovery last
  for (let i = 0; i < recoveryCount; i++) {
    schedule[totalDays - 1 - i] = recoveryWorkouts[i];
  }

  // Place long run on the day before recovery (typically Saturday)
  const longRunIndex = runWorkouts.findIndex((w) => w.title === "Long Run");
  if (longRunIndex >= 0) {
    const saturdaySlot = totalDays - 1 - recoveryCount;
    schedule[saturdaySlot] = runWorkouts[longRunIndex];
    runWorkouts.splice(longRunIndex, 1);
  }

  // Fill remaining slots alternating lift/run
  let liftIdx = 0;
  let runIdx = 0;
  let lastType = null;

  for (let i = 0; i < totalDays; i++) {
    if (schedule[i]) continue; // Already placed

    // Prefer alternating
    if (lastType === "Lift" && runIdx < runWorkouts.length) {
      schedule[i] = runWorkouts[runIdx++];
      lastType = "Run";
    } else if (lastType === "Run" && liftIdx < liftWorkouts.length) {
      schedule[i] = liftWorkouts[liftIdx++];
      lastType = "Lift";
    } else if (liftIdx < liftWorkouts.length) {
      schedule[i] = liftWorkouts[liftIdx++];
      lastType = "Lift";
    } else if (runIdx < runWorkouts.length) {
      schedule[i] = runWorkouts[runIdx++];
      lastType = "Run";
    }
  }

  // Assign day names
  for (let i = 0; i < totalDays; i++) {
    if (schedule[i]) {
      workouts.push({
        day: dayNames[i],
        dayNumber: i + 1,
        type: schedule[i].type,
        title: schedule[i].title,
        exercises: schedule[i].exercises,
      });
    }
  }

  return workouts;
}

// ─── AI Custom Workout Generator ──────────────────────────────────────

const splitLabels = {
  ppl: "Push/Pull/Legs",
  arnold: "Arnold Split (Chest+Back, Shoulders+Arms, Legs)",
  bro_split: "Bro Split (Chest, Back, Shoulders, Arms, Legs)",
  upper_lower: "Upper/Lower",
  full_body: "Full Body",
};

async function generateCustomWorkouts({ archetype, trainingDays, experience, liftingSplit, customExercises }) {
  const archetypeData = typeof archetype === "string"
    ? (archetypes[archetype] || Object.values(archetypes).find(a => a.label === archetype) || archetypes.balancedAthlete)
    : archetype;

  const splitLabel = splitLabels[liftingSplit] || "default rotation";
  const exerciseList = Array.isArray(customExercises) ? customExercises.join(", ") : "";

  const prompt = `You are a certified personal trainer creating a weekly workout plan.

ATHLETE PROFILE:
- Archetype: ${archetypeData.label} (${archetypeData.description})
- Training Days Per Week: ${trainingDays}
- Experience Level: ${experience}
- Lift/Run/Recovery ratio: ${archetypeData.ratios.lift}% lift, ${archetypeData.ratios.run}% run, ${archetypeData.ratios.recovery}% recovery

LIFTING PREFERENCES:
- Preferred lifting split: ${splitLabel}
${exerciseList ? `- Favorite exercises to incorporate: ${exerciseList}` : ""}
- Structure lifting days using this split pattern.
${exerciseList ? "- Incorporate the athlete's favorite exercises into the appropriate workout days where they naturally fit." : ""}

REQUIREMENTS:
1. Generate EXACTLY ${trainingDays} workouts for one week
2. Workout types: "Run", "Lift", "Recovery"
3. Allocate days roughly matching the archetype ratios (at least 1 lift, 1 run, 1 recovery)
4. Lift exercises format: { "name": "...", "sets": 3, "reps": "8-10", "rest": "90 sec" }
5. Run exercises format: { "name": "...", "duration": "...", "pace": "...", "notes": "..." }
6. Recovery exercises format: { "name": "...", "duration": "...", "notes": "..." }
7. Days: Monday through Sunday, dayNumber 1-${trainingDays}
8. 4-7 exercises per workout
9. Alternate lift and run days. Place long run on Saturday if possible, recovery on Sunday if possible.

Respond with ONLY valid JSON (no markdown):
{
  "workouts": [
    { "dayNumber": 1, "day": "Monday", "type": "Lift", "title": "Push Day", "exercises": [...] }
  ]
}`;

  const client = await getAnthropicClient();

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.content[0]?.text || "";
      let jsonStr = text.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      const result = JSON.parse(jsonStr);

      if (!result.workouts || !Array.isArray(result.workouts) || result.workouts.length === 0) {
        throw new Error("Invalid response: missing workouts array");
      }

      return result.workouts;
    } catch (error) {
      console.error(`Custom workout generation attempt ${attempt + 1} failed:`, error.message);
      if (attempt === 1) {
        throw new Error("Failed to generate custom workouts after 2 attempts");
      }
    }
  }
}

// ─── Main Generator ────────────────────────────────────────────────────

/**
 * Generate personalized quiz-based workouts.
 *
 * @param {Object} params
 * @param {Object} params.archetype - Archetype object from determineArchetype()
 * @param {number} params.trainingDays - Number of training days (3-7)
 * @param {string} params.experience - "beginner", "intermediate", or "advanced"
 * @param {string} [params.liftingSplit] - "ppl", "arnold", "upper_lower", "bro_split", "full_body"
 * @param {string[]} [params.customExercises] - Array of exercise names to incorporate
 * @returns {Array|Promise<Array>} Array of workout objects matching { day, dayNumber, type, title, exercises }
 */
export function generateQuizWorkouts({ archetype, trainingDays = 5, experience = "intermediate", liftingSplit, customExercises }) {
  const archetypeData = typeof archetype === "string" ? archetypes[archetype] : archetype;
  const ratios = archetypeData?.ratios || archetypes.balancedAthlete.ratios;
  const days = Math.max(3, Math.min(7, trainingDays));

  // Custom exercises path: use AI to generate workouts
  if (customExercises && Array.isArray(customExercises) && customExercises.length > 0) {
    return generateCustomWorkouts({ archetype, trainingDays: days, experience, liftingSplit, customExercises });
  }

  // Split-only or default path: use static templates
  const { liftCount, runCount, recoveryCount } = allocateDayTypes(days, ratios);
  return buildSchedule(liftCount, runCount, recoveryCount, experience, liftingSplit);
}
