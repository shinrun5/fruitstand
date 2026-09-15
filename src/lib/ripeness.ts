/**
 * How close a party is to the front of the line, from 0 (just joined, behind
 * everyone) to 1 (next up). Ranks are 1-indexed within the waiting group.
 */
export function computeRipeness(rank: number, total: number): number {
  if (total <= 1) return 1;
  const ripeness = 1 - (rank - 1) / (total - 1);
  return Math.min(1, Math.max(0, ripeness));
}

export interface RipenessStage {
  label: string;
  emoji: string;
}

export function ripenessStage(ripeness: number): RipenessStage {
  if (ripeness >= 0.85) return { label: "Ripe", emoji: "🍎" };
  if (ripeness >= 0.5) return { label: "Ripening", emoji: "🍏" };
  return { label: "Growing", emoji: "🌱" };
}

/** CSS filter that makes a fruit look unripe (green, muted) when far from the
 * front of the line, and fades to its true ripe color near the top. */
export function ripenessFilter(ripeness: number): string {
  const grayscale = (1 - ripeness) * 35;
  const saturate = 35 + ripeness * 90;
  const hueRotate = (1 - ripeness) * -55;
  return `grayscale(${grayscale}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg)`;
}
