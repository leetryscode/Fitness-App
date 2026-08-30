import { MuscleRegion } from '../types/muscles';

// Hours for intensity to decay by roughly one band (tunable during dogfooding)
// Based on muscle size and typical recovery research
export const DECAY_HOURS: Record<MuscleRegion, number> = {
  // Small muscles, fast recovery (24-36h range → 30h)
  neck: 30,
  forearms: 30,
  calves: 30,
  abs: 30,
  tibialis: 30,

  // Smaller muscles, moderate recovery (36-48h range → 42h)
  biceps: 42,
  triceps: 42,
  obliques: 42,
  adductors: 42,

  // Medium muscles (48h)
  shoulders: 48,
  chest: 48,
  traps: 48,

  // Large muscles, slower recovery (48-72h range → 60h)
  quads: 60,
  lats: 60,
  hamstrings: 60,
  glutes: 60,
  'lower-back': 60,
};
