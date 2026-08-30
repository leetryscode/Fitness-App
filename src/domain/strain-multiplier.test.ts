/**
 * Unit tests for strain multiplier calculation.
 * Run: npx tsx src/domain/strain-multiplier.test.ts
 */
import {
  calculateStrainMultiplier,
  SESSION_EFFORT_MULTIPLIERS,
  DEFAULT_STRAIN_MULTIPLIER,
} from './strain-multiplier';
import { SessionEffort, SetDetail } from '../types/entry';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`PASS: ${message}`);
}

function assertApprox(actual: number, expected: number, tolerance: number, message: string) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`FAIL: ${message} (expected ~${expected}, got ${actual})`);
  }
  console.log(`PASS: ${message} (${actual.toFixed(3)})`);
}

// ============================================
// Test: No input → default 1.0x
// ============================================
assert(
  calculateStrainMultiplier(null, null) === DEFAULT_STRAIN_MULTIPLIER,
  'null/null returns default 1.0x'
);

assert(
  calculateStrainMultiplier(undefined, undefined) === DEFAULT_STRAIN_MULTIPLIER,
  'undefined/undefined returns default 1.0x'
);

assert(
  calculateStrainMultiplier(null, []) === DEFAULT_STRAIN_MULTIPLIER,
  'null effort + empty sets returns default 1.0x'
);

// ============================================
// Test: Session-level effort only (each enum value)
// ============================================
const effortLevels: SessionEffort[] = ['very_light', 'easy', 'moderate', 'hard', 'max'];

for (const effort of effortLevels) {
  const expected = SESSION_EFFORT_MULTIPLIERS[effort];
  const actual = calculateStrainMultiplier(effort, null);
  assert(
    actual === expected,
    `session_effort '${effort}' returns ${expected}x`
  );
}

// ============================================
// Test: Set-by-set with flat RPE
// ============================================
const flatRpeSets: SetDetail[] = [
  { muscleSlugs: ['chest'], rpe: 7, order: 1 },
  { muscleSlugs: ['chest'], rpe: 7, order: 2 },
  { muscleSlugs: ['chest'], rpe: 7, order: 3 },
];

const flatResult = calculateStrainMultiplier(null, flatRpeSets);
assertApprox(
  flatResult,
  1.0,
  0.15,
  'flat RPE 7 across 3 sets ≈ baseline (1.0x)'
);

// ============================================
// Test: Set-by-set with escalating RPE (later sets harder)
// ============================================
const escalatingRpeSets: SetDetail[] = [
  { muscleSlugs: ['chest'], rpe: 5, order: 1 },
  { muscleSlugs: ['chest'], rpe: 7, order: 2 },
  { muscleSlugs: ['chest'], rpe: 9, order: 3 },
];

const escalatingResult = calculateStrainMultiplier(null, escalatingRpeSets);
assert(
  escalatingResult > flatResult,
  `escalating RPE (5→7→9) produces higher multiplier (${escalatingResult.toFixed(3)}) than flat (${flatResult.toFixed(3)})`
);

// ============================================
// Test: Set-by-set with descending RPE (fatigue front-loaded)
// ============================================
const descendingRpeSets: SetDetail[] = [
  { muscleSlugs: ['chest'], rpe: 9, order: 1 },
  { muscleSlugs: ['chest'], rpe: 7, order: 2 },
  { muscleSlugs: ['chest'], rpe: 5, order: 3 },
];

const descendingResult = calculateStrainMultiplier(null, descendingRpeSets);
assert(
  descendingResult < escalatingResult,
  `descending RPE (9→7→5) produces lower multiplier (${descendingResult.toFixed(3)}) than escalating (${escalatingResult.toFixed(3)})`
);

// ============================================
// Test: Sets with null RPE values are ignored
// ============================================
const mixedRpeSets: SetDetail[] = [
  { muscleSlugs: ['chest'], rpe: null, order: 1 },
  { muscleSlugs: ['chest'], rpe: 8, order: 2 },
  { muscleSlugs: ['chest'], rpe: 8, order: 3 },
];

const mixedResult = calculateStrainMultiplier(null, mixedRpeSets);
assert(
  mixedResult > 0.5 && mixedResult < 1.6,
  `sets with some null RPE still compute valid multiplier (${mixedResult.toFixed(3)})`
);

// ============================================
// Test: All-null RPE sets fall back to default
// ============================================
const allNullRpeSets: SetDetail[] = [
  { muscleSlugs: ['chest'], rpe: null, order: 1 },
  { muscleSlugs: ['chest'], rpe: null, order: 2 },
];

assert(
  calculateStrainMultiplier(null, allNullRpeSets) === DEFAULT_STRAIN_MULTIPLIER,
  'all-null RPE sets returns default 1.0x'
);

// ============================================
// Test: Sets take priority over session_effort
// ============================================
const setsWithSessionEffort = calculateStrainMultiplier('very_light', flatRpeSets);
assert(
  setsWithSessionEffort !== SESSION_EFFORT_MULTIPLIERS.very_light,
  'sets data takes priority over session_effort'
);

// ============================================
// Test: High volume session (many sets)
// ============================================
const highVolumeSets: SetDetail[] = Array.from({ length: 6 }, (_, i) => ({
  muscleSlugs: ['quads'],
  rpe: 8,
  order: i + 1,
}));

const highVolumeResult = calculateStrainMultiplier(null, highVolumeSets);
assert(
  highVolumeResult > 1.0,
  `high volume (6 sets @ RPE 8) produces elevated multiplier (${highVolumeResult.toFixed(3)})`
);

// ============================================
// Test: Very light session
// ============================================
const lightSets: SetDetail[] = [
  { muscleSlugs: ['biceps'], rpe: 4, order: 1 },
  { muscleSlugs: ['biceps'], rpe: 4, order: 2 },
];

const lightResult = calculateStrainMultiplier(null, lightSets);
assert(
  lightResult < 1.0,
  `light session (2 sets @ RPE 4) produces reduced multiplier (${lightResult.toFixed(3)})`
);

// ============================================
// Test: Clamping at max
// ============================================
const extremeSets: SetDetail[] = Array.from({ length: 10 }, (_, i) => ({
  muscleSlugs: ['quads'],
  rpe: 10,
  order: i + 1,
}));

const extremeResult = calculateStrainMultiplier(null, extremeSets);
assert(
  extremeResult <= 1.6,
  `extreme session is clamped at max 1.6x (got ${extremeResult.toFixed(3)})`
);

// ============================================
// Test: Clamping at min
// ============================================
const minimalSets: SetDetail[] = [
  { muscleSlugs: ['abs'], rpe: 1, order: 1 },
];

const minimalResult = calculateStrainMultiplier(null, minimalSets);
assert(
  minimalResult >= 0.5,
  `minimal session is clamped at min 0.5x (got ${minimalResult.toFixed(3)})`
);

console.log('\n✓ All strain multiplier tests passed.');
