/**
 * Quick sanity check for recovery decay logic.
 * Run: npx tsx src/domain/recovery.test.ts
 */
import { computeRegionFatigue, computeEffectiveIntensity } from './recovery';
import { Entry } from '../types/entry';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

// Fresh quads after heavy squat should be fatigued
const squatEntry: Entry = {
  id: '1',
  timestamp: Date.now(),
  rawUserText: 'did squats 8/10',
  rawAiResponse: 'Logged quads',
  imageReference: null,
  parsedMuscleTags: [{ region: 'quads', intensity: 9 }],
  source: 'chat',
};

const fatigueNow = computeRegionFatigue([squatEntry]);
assert(fatigueNow.quads === 'fatigued', 'quads should be fatigued immediately after heavy squats');

// After 72+ hours, quads should decay
const oldSquat: Entry = {
  ...squatEntry,
  timestamp: Date.now() - 80 * 60 * 60 * 1000,
};
const fatigueLater = computeRegionFatigue([oldSquat]);
assert(
  fatigueLater.quads === 'recovering' || fatigueLater.quads === 'fresh' || fatigueLater.quads === 'tired',
  'quads should decay after 80 hours'
);

// Effective intensity decreases over time
const effectiveFresh = computeEffectiveIntensity(9, 0, 'quads');
const effectiveOld = computeEffectiveIntensity(9, 80, 'quads');
assert(effectiveFresh > effectiveOld, 'intensity should decay over time');

// Untrained regions stay fresh
assert(fatigueNow.chest === 'fresh', 'chest should remain fresh if not worked');

console.log('\nAll recovery tests passed.');
