import { MuscleRegion } from './muscles';
import type { Slug } from 'react-native-body-highlighter';

export type BodyHighlighterSlug = Slug;

/**
 * Mapping from our internal MuscleRegion to the library's slug(s).
 * Some of our regions map to a single slug, others map to multiple for better visual coverage.
 */
export const REGION_TO_SLUGS: Record<MuscleRegion, BodyHighlighterSlug[]> = {
  shoulders: ['deltoids'],
  chest: ['chest'],
  biceps: ['biceps'],
  forearms: ['forearm'],
  abs: ['abs'],
  quads: ['quadriceps'],
  calves: ['calves'],
  lats: ['upper-back'],
  traps: ['trapezius'],
  hamstrings: ['hamstring'],
  glutes: ['gluteal'],
};

/**
 * Reverse mapping: from library slug back to our MuscleRegion (if tracked).
 * Slugs not in our model return undefined.
 */
export const SLUG_TO_REGION: Partial<Record<BodyHighlighterSlug, MuscleRegion>> = {
  deltoids: 'shoulders',
  chest: 'chest',
  biceps: 'biceps',
  forearm: 'forearms',
  abs: 'abs',
  quadriceps: 'quads',
  calves: 'calves',
  'upper-back': 'lats',
  trapezius: 'traps',
  hamstring: 'hamstrings',
  gluteal: 'glutes',
};

/**
 * Library slugs we don't currently track in our muscle model.
 * These will use defaultFill (fresh/untracked appearance).
 *
 * Gaps and recommendations:
 * - triceps: Distinct muscle, consider adding to our model (pushed by bench, dips, pushdowns)
 * - obliques: Could merge with 'abs' or track separately
 * - lower-back: Could add as separate region (deadlifts, rows)
 * - adductors: Inner thigh - could merge into 'quads' category or add
 * - tibialis: Front shin - low priority, rarely isolated
 * - neck: Could add for shrug/neck work
 * - hands/feet/head/hair/ankles/knees: Non-muscle parts, fine to leave untracked
 *
 * Note: The library's README mentions "abductors" but the TypeScript types don't include it.
 */
export const UNTRACKED_SLUGS: BodyHighlighterSlug[] = [
  'triceps',
  'obliques',
  'lower-back',
  'adductors',
  'tibialis',
  'neck',
  'hands',
  'feet',
  'head',
  'hair',
  'ankles',
  'knees',
];

/**
 * Slugs visible on front view of the body
 */
export const FRONT_SLUGS: BodyHighlighterSlug[] = [
  'deltoids',
  'chest',
  'biceps',
  'forearm',
  'abs',
  'quadriceps',
  'calves',
  'tibialis',
  'obliques',
  'neck',
  'head',
  'hands',
  'feet',
  'ankles',
  'knees',
  'hair',
];

/**
 * Slugs visible on back view of the body
 */
export const BACK_SLUGS: BodyHighlighterSlug[] = [
  'deltoids',
  'trapezius',
  'triceps',
  'forearm',
  'upper-back',
  'lower-back',
  'hamstring',
  'gluteal',
  'calves',
  'adductors',
  'neck',
  'head',
  'hands',
  'feet',
  'ankles',
  'hair',
];
