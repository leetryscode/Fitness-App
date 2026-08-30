import { colors } from '../theme/tokens';

export type FatigueLevel = 'fresh' | 'recovering' | 'tired' | 'fatigued';

export const FATIGUE_LEVELS: FatigueLevel[] = [
  'fresh',
  'recovering',
  'tired',
  'fatigued',
];

export const FATIGUE_COLORS: Record<FatigueLevel, string> = {
  fresh: colors.fresh,
  recovering: colors.recovering,
  tired: colors.tired,
  fatigued: colors.fatigued,
};

export const FATIGUE_LABELS: Record<FatigueLevel, string> = {
  fresh: 'Fresh',
  recovering: 'Recovering',
  tired: 'Tired',
  fatigued: 'Fatigued',
};

export function intensityToFatigueLevel(intensity: number): FatigueLevel {
  if (intensity >= 8) return 'fatigued';
  if (intensity >= 6) return 'tired';
  if (intensity >= 4) return 'recovering';
  return 'fresh';
}
