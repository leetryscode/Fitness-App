import { MuscleRegion } from './muscles';
import type { Slug } from 'react-native-body-highlighter';

export type BodyHighlighterSlug = Slug;

/**
 * Mapping from our internal MuscleRegion to the library's slug(s).
 * All 17 tracked muscle regions map 1:1 to library slugs.
 */
export const REGION_TO_SLUGS: Record<MuscleRegion, BodyHighlighterSlug[]> = {
  neck: ['neck'],
  shoulders: ['deltoids'],
  chest: ['chest'],
  biceps: ['biceps'],
  triceps: ['triceps'],
  forearms: ['forearm'],
  traps: ['trapezius'],
  lats: ['upper-back'],
  'lower-back': ['lower-back'],
  abs: ['abs'],
  obliques: ['obliques'],
  quads: ['quadriceps'],
  hamstrings: ['hamstring'],
  glutes: ['gluteal'],
  adductors: ['adductors'],
  calves: ['calves'],
  tibialis: ['tibialis'],
};

/**
 * Reverse mapping: from library slug back to our MuscleRegion.
 * All 17 muscle-relevant slugs are now tracked.
 */
export const SLUG_TO_REGION: Record<BodyHighlighterSlug, MuscleRegion | undefined> = {
  neck: 'neck',
  deltoids: 'shoulders',
  chest: 'chest',
  biceps: 'biceps',
  triceps: 'triceps',
  forearm: 'forearms',
  trapezius: 'traps',
  'upper-back': 'lats',
  'lower-back': 'lower-back',
  abs: 'abs',
  obliques: 'obliques',
  quadriceps: 'quads',
  hamstring: 'hamstrings',
  gluteal: 'glutes',
  adductors: 'adductors',
  calves: 'calves',
  tibialis: 'tibialis',
  // Non-muscle parts (not tracked)
  head: undefined,
  hair: undefined,
  hands: undefined,
  feet: undefined,
  knees: undefined,
  ankles: undefined,
};

/**
 * Non-muscle body parts in the library (not tracked for recovery).
 * These will use defaultFill appearance.
 */
export const NON_MUSCLE_SLUGS: BodyHighlighterSlug[] = [
  'head',
  'hair',
  'hands',
  'feet',
  'knees',
  'ankles',
];

/**
 * Muscle slugs visible on front view of the body
 */
export const FRONT_MUSCLE_SLUGS: BodyHighlighterSlug[] = [
  'neck',
  'deltoids',
  'chest',
  'biceps',
  'forearm',
  'abs',
  'obliques',
  'quadriceps',
  'adductors',
  'calves',
  'tibialis',
];

/**
 * Muscle slugs visible on back view of the body
 */
export const BACK_MUSCLE_SLUGS: BodyHighlighterSlug[] = [
  'neck',
  'deltoids',
  'triceps',
  'forearm',
  'trapezius',
  'upper-back',
  'lower-back',
  'hamstring',
  'gluteal',
  'adductors',
  'calves',
];
