import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Body, { type Slug, type ExtendedBodyPart } from 'react-native-body-highlighter';
import { Legend } from '../BodyMap/Legend';
import { colors, spacing, radii } from '../../theme/tokens';
import { FATIGUE_COLORS, intensityToFatigueLevel } from '../../types/fatigue';
import { DECAY_HOURS } from '../../domain/decay-rates';
import { SLUG_TO_REGION } from '../../types/bodyHighlighterSlugs';

type RecoveryEntry = {
  hoursSinceWorked: number;
  intensity?: number;
};

export type RecoveryState = {
  [slug: string]: RecoveryEntry;
};

type Props = {
  recoveryState: RecoveryState;
  gender?: 'male' | 'female';
  scale?: number;
};

const DEFAULT_DECAY_HOURS = 48;
const DEFAULT_INTENSITY = 10;

function computeEffectiveIntensity(
  intensity: number,
  elapsedHours: number,
  decayHours: number
): number {
  return intensity * Math.exp(-elapsedHours / decayHours);
}

function getDecayHoursForSlug(slug: Slug): number {
  const region = SLUG_TO_REGION[slug];
  if (region && DECAY_HOURS[region] !== undefined) {
    return DECAY_HOURS[region];
  }
  return DEFAULT_DECAY_HOURS;
}

function getColorForRecoveryEntry(
  slug: Slug,
  entry: RecoveryEntry
): string {
  const decayHours = getDecayHoursForSlug(slug);
  const intensity = entry.intensity ?? DEFAULT_INTENSITY;
  const effectiveIntensity = computeEffectiveIntensity(
    intensity,
    entry.hoursSinceWorked,
    decayHours
  );
  const fatigueLevel = intensityToFatigueLevel(effectiveIntensity);
  return FATIGUE_COLORS[fatigueLevel];
}

export function RecoveryMap({
  recoveryState,
  gender = 'male',
  scale = 1.2,
}: Props) {
  const [view, setView] = useState<'front' | 'back'>('front');

  const bodyData = useMemo((): ExtendedBodyPart[] => {
    const data: ExtendedBodyPart[] = [];

    for (const [slug, entry] of Object.entries(recoveryState)) {
      const typedSlug = slug as Slug;
      const color = getColorForRecoveryEntry(typedSlug, entry);
      data.push({ slug: typedSlug, color });
    }

    return data;
  }, [recoveryState]);

  return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        <Pressable
          style={[styles.toggleBtn, view === 'front' && styles.toggleBtnActive]}
          onPress={() => setView('front')}
        >
          <Text
            style={[
              styles.toggleText,
              view === 'front' && styles.toggleTextActive,
            ]}
          >
            Front
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, view === 'back' && styles.toggleBtnActive]}
          onPress={() => setView('back')}
        >
          <Text
            style={[
              styles.toggleText,
              view === 'back' && styles.toggleTextActive,
            ]}
          >
            Back
          </Text>
        </Pressable>
      </View>

      <View style={styles.bodyContainer}>
        <Body
          data={bodyData}
          side={view}
          gender={gender}
          scale={scale}
          border="none"
          defaultFill={colors.fresh}
        />
      </View>

      <Legend />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  toggleBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  toggleBtnActive: {
    borderColor: colors.border,
  },
  toggleText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  bodyContainer: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
