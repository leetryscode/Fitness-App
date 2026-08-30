import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';
import { FATIGUE_LEVELS, FATIGUE_COLORS, FATIGUE_LABELS } from '../../types/fatigue';

export function Legend() {
  return (
    <View style={styles.container}>
      {FATIGUE_LEVELS.map((level) => (
        <View key={level} style={styles.item}>
          <View
            style={[styles.swatch, { backgroundColor: FATIGUE_COLORS[level] }]}
          />
          <Text style={styles.label}>{FATIGUE_LABELS[level]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 10,
  },
});
