export const MUSCLE_REGIONS = [
  'neck',
  'shoulders',
  'chest',
  'biceps',
  'triceps',
  'forearms',
  'traps',
  'lats',
  'lower-back',
  'abs',
  'obliques',
  'quads',
  'hamstrings',
  'glutes',
  'adductors',
  'calves',
  'tibialis',
] as const;

export type MuscleRegion = (typeof MUSCLE_REGIONS)[number];

export const FRONT_REGIONS: MuscleRegion[] = [
  'neck',
  'shoulders',
  'chest',
  'biceps',
  'forearms',
  'abs',
  'obliques',
  'quads',
  'adductors',
  'calves',
  'tibialis',
];

export const BACK_REGIONS: MuscleRegion[] = [
  'neck',
  'shoulders',
  'triceps',
  'forearms',
  'traps',
  'lats',
  'lower-back',
  'hamstrings',
  'glutes',
  'adductors',
  'calves',
];

export const ALL_REGIONS = MUSCLE_REGIONS;
