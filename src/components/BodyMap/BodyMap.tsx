import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { BodyFigureFront } from './BodyFigureFront';
import { BodyFigureBack } from './BodyFigureBack';
import { Legend } from './Legend';
import { MuscleRegion } from '../../types/muscles';
import { FatigueLevel } from '../../types/fatigue';
import { colors, spacing, radii } from '../../theme/tokens';

type Props = {
  fatigue: Record<MuscleRegion, FatigueLevel>;
};

export function BodyMap({ fatigue }: Props) {
  const [view, setView] = useState<'front' | 'back'>('front');

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

      <View style={styles.figureContainer}>
        {view === 'front' ? (
          <BodyFigureFront fatigue={fatigue} />
        ) : (
          <BodyFigureBack fatigue={fatigue} />
        )}
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
  figureContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
