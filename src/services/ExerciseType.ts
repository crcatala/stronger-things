const UNKNOWN_TYPE = "Unknown";
const EXERCISE_TYPES: any = {
  0: "Barbell",
  1: "Dumbbell",
  2: "Machine / Other",
  3: "Weighted Bodyweight",
  4: "Assisted Bodyweight",
  5: "Reps Only",
  6: "Cardio",
  7: "Duration"
};

export function getExerciseTypeName(num: number) {
  return EXERCISE_TYPES[num] || UNKNOWN_TYPE;
}
