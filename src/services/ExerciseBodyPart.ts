const UNKNOWN_TYPE = "Unknown";
const EXERCISE_BODY_PARTS: any = {
  1: "Core",
  2: "Arms",
  4: "Back",
  8: "Chest",
  16: "Legs",
  32: "Shoulders",
  64: "Other",
  128: "Olympic",
  256: "Full Body",
  512: "Cardio"
};

export const EXERCISE_BODY_PART_OPTIONS = Object.entries(
  EXERCISE_BODY_PARTS
).map((x: any) => ({ id: x[0], name: x[1] }));

export function getExerciseBodyPartName(num: number): string {
  return EXERCISE_BODY_PARTS[num] || UNKNOWN_TYPE;
}
