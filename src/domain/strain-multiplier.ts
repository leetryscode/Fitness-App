import { SessionEffort, SetDetail } from '../types/entry';

/**
 * ENGINEERING ESTIMATES - NOT FROM PUBLISHED STUDIES
 * These multiplier values are tunable constants based on reasonable assumptions
 * about how session effort affects recovery time. Adjust as needed during dogfooding.
 */

/** Direct mapping from session-level effort to strain multiplier */
export const SESSION_EFFORT_MULTIPLIERS: Record<SessionEffort, number> = {
  very_light: 0.55,
  easy: 0.75,
  moderate: 1.0,
  hard: 1.25,
  max: 1.5,
} as const;

/** Default multiplier when no effort info is provided */
export const DEFAULT_STRAIN_MULTIPLIER = 1.0;

/** RPE value assumed for "typical" baseline session (used for normalization) */
const BASELINE_RPE = 7;

/** Number of sets in a "typical" baseline session */
const BASELINE_SETS = 3;

/**
 * Recency weight increment per set.
 * Later sets in a session contribute more to fatigue (accumulated fatigue effect).
 * Set 1 = 1.0, Set 2 = 1.1, Set 3 = 1.2, etc.
 */
const RECENCY_WEIGHT_INCREMENT = 0.1;

/**
 * Calculate the baseline score for a "typical" session.
 * Used to normalize set-by-set strain scores to a ~1.0x multiplier.
 */
function getBaselineSessionScore(): number {
  let score = 0;
  for (let i = 0; i < BASELINE_SETS; i++) {
    const recencyWeight = 1.0 + i * RECENCY_WEIGHT_INCREMENT;
    score += BASELINE_RPE * recencyWeight;
  }
  return score;
}

const BASELINE_SESSION_SCORE = getBaselineSessionScore();

/**
 * Clamp the final multiplier to a reasonable range.
 * Prevents extreme values from unrealistic inputs.
 */
const MIN_MULTIPLIER = 0.5;
const MAX_MULTIPLIER = 1.6;

function clampMultiplier(value: number): number {
  return Math.max(MIN_MULTIPLIER, Math.min(MAX_MULTIPLIER, value));
}

/**
 * Calculate strain multiplier from set-by-set data.
 * Uses recency-weighted RPE values, normalized against a baseline session.
 */
function calculateFromSets(sets: SetDetail[]): number {
  if (sets.length === 0) return DEFAULT_STRAIN_MULTIPLIER;

  const setsWithRpe = sets.filter((s) => s.rpe !== null && s.rpe > 0);
  if (setsWithRpe.length === 0) return DEFAULT_STRAIN_MULTIPLIER;

  const sortedSets = [...setsWithRpe].sort((a, b) => a.order - b.order);

  let weightedSum = 0;
  for (let i = 0; i < sortedSets.length; i++) {
    const set = sortedSets[i];
    const recencyWeight = 1.0 + i * RECENCY_WEIGHT_INCREMENT;
    weightedSum += (set.rpe ?? 0) * recencyWeight;
  }

  const normalizedMultiplier = weightedSum / BASELINE_SESSION_SCORE;
  return clampMultiplier(normalizedMultiplier);
}

/**
 * Calculate strain multiplier for a workout session.
 *
 * Priority order:
 * 1. If sets array has RPE data → compute weighted strain from sets
 * 2. Else if sessionEffort is set → use direct lookup table
 * 3. Else → return 1.0 (default, no adjustment)
 *
 * This function degrades gracefully: no mandatory input required.
 * When user provides no effort info, defaults to moderate (1.0x).
 *
 * @param sessionEffort - Overall session effort level (nullable)
 * @param sets - Per-set detail with RPE values (nullable/empty)
 * @returns Strain multiplier in range [0.5, 1.6]
 */
export function calculateStrainMultiplier(
  sessionEffort: SessionEffort | null | undefined,
  sets: SetDetail[] | null | undefined
): number {
  if (sets && sets.length > 0) {
    const hasAnyRpe = sets.some((s) => s.rpe !== null && s.rpe > 0);
    if (hasAnyRpe) {
      return calculateFromSets(sets);
    }
  }

  if (sessionEffort && SESSION_EFFORT_MULTIPLIERS[sessionEffort] !== undefined) {
    return SESSION_EFFORT_MULTIPLIERS[sessionEffort];
  }

  return DEFAULT_STRAIN_MULTIPLIER;
}
