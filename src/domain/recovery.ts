import { ALL_REGIONS, MuscleRegion } from '../types/muscles';
import { Entry } from '../types/entry';
import { FatigueLevel, intensityToFatigueLevel } from '../types/fatigue';
import { DECAY_HOURS } from './decay-rates';

export function computeEffectiveIntensity(
  intensity: number,
  elapsedHours: number,
  region: MuscleRegion
): number {
  const decayHours = DECAY_HOURS[region];
  return intensity * Math.exp(-elapsedHours / decayHours);
}

export function computeRegionFatigue(
  entries: Entry[],
  now: Date = new Date()
): Record<MuscleRegion, FatigueLevel> {
  const nowMs = now.getTime();
  const result = {} as Record<MuscleRegion, FatigueLevel>;

  for (const region of ALL_REGIONS) {
    let maxEffective = 0;

    for (const entry of entries) {
      for (const tag of entry.parsedMuscleTags) {
        if (tag.region !== region) continue;
        const elapsedHours = (nowMs - entry.timestamp) / (1000 * 60 * 60);
        const effective = computeEffectiveIntensity(
          tag.intensity,
          elapsedHours,
          region
        );
        maxEffective = Math.max(maxEffective, effective);
      }
    }

    result[region] =
      maxEffective > 0 ? intensityToFatigueLevel(maxEffective) : 'fresh';
  }

  return result;
}

export function computeRegionIntensities(
  entries: Entry[],
  now: Date = new Date()
): Record<MuscleRegion, number> {
  const nowMs = now.getTime();
  const result = {} as Record<MuscleRegion, number>;

  for (const region of ALL_REGIONS) {
    let maxEffective = 0;

    for (const entry of entries) {
      for (const tag of entry.parsedMuscleTags) {
        if (tag.region !== region) continue;
        const elapsedHours = (nowMs - entry.timestamp) / (1000 * 60 * 60);
        const effective = computeEffectiveIntensity(
          tag.intensity,
          elapsedHours,
          region
        );
        maxEffective = Math.max(maxEffective, effective);
      }
    }

    result[region] = maxEffective;
  }

  return result;
}
