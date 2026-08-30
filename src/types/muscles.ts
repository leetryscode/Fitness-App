export const MUSCLE_REGIONS = [
  'shoulders',
  'chest',
  'biceps',
  'forearms',
  'abs',
  'quads',
  'calves',
  'lats',
  'traps',
  'hamstrings',
  'glutes',
] as const;

export type MuscleRegion = (typeof MUSCLE_REGIONS)[number];

export const FRONT_REGIONS: MuscleRegion[] = [
  'shoulders',
  'chest',
  'biceps',
  'forearms',
  'abs',
  'quads',
  'calves',
];

export const BACK_REGIONS: MuscleRegion[] = [
  'shoulders',
  'lats',
  'traps',
  'forearms',
  'hamstrings',
  'glutes',
  'calves',
];

export const ALL_REGIONS = MUSCLE_REGIONS;
