const UNKNOWN_TYPE = "Unknown";

export const EXERCISE_TYPE_BARBELL = 0;
export const EXERCISE_TYPE_DUMBBELL = 1;
export const EXERCISE_TYPE_MACHINE = 2;
export const EXERCISE_TYPE_BODYWEIGHT = 3;
export const EXERCISE_TYPE_ASSISTED_BODYWEIGHT = 4;
export const EXERCISE_TYPE_REPS_ONLY = 5;
export const EXERCISE_TYPE_CARDIO = 6;
export const EXERCISE_TYPE_DURATION = 7;

const EXERCISE_TYPES: any = {
  [EXERCISE_TYPE_BARBELL]: "Barbell",
  [EXERCISE_TYPE_DUMBBELL]: "Dumbbell",
  [EXERCISE_TYPE_MACHINE]: "Machine / Other",
  [EXERCISE_TYPE_BODYWEIGHT]: "Weighted Bodyweight",
  [EXERCISE_TYPE_ASSISTED_BODYWEIGHT]: "Assisted Bodyweight",
  [EXERCISE_TYPE_REPS_ONLY]: "Reps Only",
  [EXERCISE_TYPE_CARDIO]: "Cardio",
  [EXERCISE_TYPE_DURATION]: "Duration"
};

export const EXERCISE_TYPE_OPTIONS = Object.entries(EXERCISE_TYPES).map(
  (x: any) => ({ id: parseInt(x[0]), name: x[1] })
);

export function getExerciseTypeName(num: number) {
  return EXERCISE_TYPES[num] || UNKNOWN_TYPE;
}

export function isWeightType(exerciseType: number): boolean {
  return [
    EXERCISE_TYPE_BARBELL,
    EXERCISE_TYPE_DUMBBELL,
    EXERCISE_TYPE_MACHINE,
    EXERCISE_TYPE_BODYWEIGHT,
    EXERCISE_TYPE_ASSISTED_BODYWEIGHT,
    EXERCISE_TYPE_REPS_ONLY
  ].includes(exerciseType);
}

export function isCardioType(exerciseType: number): boolean {
  return [EXERCISE_TYPE_CARDIO].includes(exerciseType);
}
