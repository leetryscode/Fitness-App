import type { Slug } from 'react-native-body-highlighter';
import { Entry } from '../../types/entry';
import { REGION_TO_SLUGS } from '../../types/bodyHighlighterSlugs';
import type { RecoveryState } from './RecoveryMap';

/**
 * Converts workout entries to RecoveryState format for the RecoveryMap component.
 *
 * For each muscle tag in entries, finds the most recent occurrence and computes
 * hours since it was worked. If a muscle was worked multiple times, takes the
 * highest intensity from the most recent session.
 */
export function entriesToRecoveryState(
  entries: Entry[],
  now: Date = new Date()
): RecoveryState {
  const nowMs = now.getTime();
  const state: RecoveryState = {};

  const slugData: Map<Slug, { timestamp: number; intensity: number }[]> = new Map();

  for (const entry of entries) {
    for (const tag of entry.parsedMuscleTags) {
      const slugs = REGION_TO_SLUGS[tag.region];
      if (!slugs) continue;

      for (const slug of slugs) {
        if (!slugData.has(slug)) {
          slugData.set(slug, []);
        }
        slugData.get(slug)!.push({
          timestamp: entry.timestamp,
          intensity: tag.intensity,
        });
      }
    }
  }

  for (const [slug, occurrences] of slugData) {
    if (occurrences.length === 0) continue;

    const sorted = occurrences.sort((a, b) => b.timestamp - a.timestamp);
    const mostRecent = sorted[0];

    const sameSessionOccurrences = sorted.filter(
      (o) => o.timestamp === mostRecent.timestamp
    );
    const maxIntensity = Math.max(...sameSessionOccurrences.map((o) => o.intensity));

    const hoursSinceWorked = (nowMs - mostRecent.timestamp) / (1000 * 60 * 60);

    state[slug] = {
      hoursSinceWorked,
      intensity: maxIntensity,
    };
  }

  return state;
}
