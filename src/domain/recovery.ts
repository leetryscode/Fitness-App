import { ALL_REGIONS, MuscleRegion } from '../types/muscles';
import { Entry } from '../types/entry';
import { FatigueLevel, intensityToFatigueLevel } from '../types/fatigue';
import { DECAY_HOURS } from './decay-rates';
import { calculateStrainMultiplier } from './strain-multiplier';

/**
 * Compute effective intensity of a muscle after time has elapsed.
 *
 * @param intensity - Initial intensity (1-10)
 * @param elapsedHours - Hours since the workout
 * @param region - Muscle region (determines base decay rate)
 * @param strainMultiplier - Optional strain multiplier (default 1.0)
 *   Values > 1.0 = harder session, slower recovery
 *   Values < 1.0 = easier session, faster recovery
 */
export function computeEffectiveIntensity(
  intensity: number,
  elapsedHours: number,
  region: MuscleRegion,
  strainMultiplier: number = 1.0
): number {
  const baseDecayHours = DECAY_HOURS[region];
  const adjustedDecayHours = baseDecayHours * strainMultiplier;
  return intensity * Math.exp(-elapsedHours / adjustedDecayHours);
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
      const strainMultiplier = calculateStrainMultiplier(
        entry.sessionEffort,
        entry.sets
      );

      for (const tag of entry.parsedMuscleTags) {
        if (tag.region !== region) continue;
        const elapsedHours = (nowMs - entry.timestamp) / (1000 * 60 * 60);
        const effective = computeEffectiveIntensity(
          tag.intensity,
          elapsedHours,
          region,
          strainMultiplier
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
      const strainMultiplier = calculateStrainMultiplier(
        entry.sessionEffort,
        entry.sets
      );

      for (const tag of entry.parsedMuscleTags) {
        if (tag.region !== region) continue;
        const elapsedHours = (nowMs - entry.timestamp) / (1000 * 60 * 60);
        const effective = computeEffectiveIntensity(
          tag.intensity,
          elapsedHours,
          region,
          strainMultiplier
        );
        maxEffective = Math.max(maxEffective, effective);
      }
    }

    result[region] = maxEffective;
  }

  return result;
}
