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

export const EXERCISE_TYPE_OPTIONS = Object.entries(EXERCISE_TYPES).map(
  (x: any) => ({ id: parseInt(x[0]), name: x[1] })
);

export function getExerciseTypeName(num: number) {
  return EXERCISE_TYPES[num] || UNKNOWN_TYPE;
}
