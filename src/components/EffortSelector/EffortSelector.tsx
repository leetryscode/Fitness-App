import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SessionEffort } from '../../types/entry';
import { colors, spacing, radii } from '../../theme/tokens';

type Props = {
  value: SessionEffort | null;
  onChange: (effort: SessionEffort | null) => void;
  disabled?: boolean;
};

const EFFORT_OPTIONS: { value: SessionEffort; label: string; emoji: string }[] = [
  { value: 'very_light', label: 'Very Light', emoji: '😌' },
  { value: 'easy', label: 'Easy', emoji: '🙂' },
  { value: 'moderate', label: 'Moderate', emoji: '😐' },
  { value: 'hard', label: 'Hard', emoji: '😤' },
  { value: 'max', label: 'Max', emoji: '🔥' },
];

export function EffortSelector({ value, onChange, disabled }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Session effort (optional)</Text>
      <View style={styles.chips}>
        {EFFORT_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <Pressable
              key={option.value}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
                disabled && styles.chipDisabled,
              ]}
              onPress={() => {
                if (disabled) return;
                onChange(isSelected ? null : option.value);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled }}
              accessibilityLabel={`${option.label} effort`}
            >
              <Text style={styles.chipEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.chipLabel,
                  isSelected && styles.chipLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.muted,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: {
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.muted,
  },
  chipLabelSelected: {
    color: colors.text,
    fontWeight: '600',
  },
});
