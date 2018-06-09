function roundHalf(num) {
  return Math.round(num * 2) / 2.0;
}

//
// https://www.athlegan.com/calculate-1rm
// Brzycki formula
//
export function calculate1RM({ weight, rpe, reps } = {}) {
  return Math.round(weight / (1.0278 - 0.0278 * reps));
}
