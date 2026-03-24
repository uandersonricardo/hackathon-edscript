export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(t, 1);
}
