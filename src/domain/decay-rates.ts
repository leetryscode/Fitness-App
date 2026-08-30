import { MuscleRegion } from '../types/muscles';

// Hours for intensity to decay by roughly one band (tunable during dogfooding)
export const DECAY_HOURS: Record<MuscleRegion, number> = {
  biceps: 36,
  forearms: 36,
  shoulders: 48,
  chest: 48,
  abs: 48,
  quads: 72,
  hamstrings: 72,
  glutes: 72,
  calves: 60,
  lats: 60,
  traps: 60,
};
