import { weightInPounds } from "@/services/UnitConversion";

function roundHalf(num: number): number {
  return Math.round(num * 2) / 2.0;
}

//
// https://www.athlegan.com/calculate-1rm
// Brzycki formula
//
export function calculate1RM({
  weight,
  reps
}: { weight?: number; reps?: number } = {}) {
  if (weight && reps) {
    return Math.round(weight / (1.0278 - 0.0278 * reps));
  } else {
    return 0;
  }
}

export function calculateAverage1RM(sets: Array<any>) {
  // TODO:not sure how to handle different exercise types and if 0 is an appropriate default
  const setsWith1RM = sets.map(set => {
    return calculate1RM({
      weight: weightInPounds(set.kilograms || 0),
      reps: set.reps || set.expectedReps
    });
  });
  const average = Math.round(
    setsWith1RM.reduce((p, c) => p + c, 0) / setsWith1RM.length
  );
  return average;
}
