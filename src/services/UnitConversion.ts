export function weightInPounds(kilograms: number): number {
  if (!kilograms) {
    // return -1;
    return 0;
  } else {
    return Math.round(kilograms * 2.20462);
  }
}

export function distanceInMiles(meters: number): number {
  if (!meters) {
    // return -1;
    return 0;
  } else {
    return meters * 0.000621371;
  }
}
