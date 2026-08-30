import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Entry, SessionEffort } from '../../types/entry';
import { colors, spacing, radii } from '../../theme/tokens';

type Props = {
  entries: Entry[];
};

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * Color mapping for workout days based on session effort.
 * These colors do NOT decay - they simply indicate effort level on that day.
 */
const EFFORT_COLORS: Record<SessionEffort, string> = {
  very_light: '#A7F3D0', // light green
  easy: '#FDE047',       // yellow
  moderate: '#FB923C',   // orange
  hard: '#EF4444',       // red
  max: '#B91C1C',        // dark red
};

const DEFAULT_WORKOUT_COLOR = '#FB923C'; // orange for workouts with no effort specified
const EMPTY_COLOR = '#F3F4F6';           // light gray for no workout
const TODAY_COLOR = '#FFFFFF';           // white for today (unfilled)

type DayData = {
  date: Date;
  label: string;
  isToday: boolean;
  hasWorkout: boolean;
  effort: SessionEffort | null;
  color: string;
};

function getStartOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function getDayOfWeek(date: Date): number {
  return date.getDay();
}

export function WeeklyActivity({ entries }: Props) {
  const weekData = useMemo((): DayData[] => {
    const now = new Date();
    const todayStart = getStartOfDay(now);
    const days: DayData[] = [];

    // Build map of day -> highest effort workout
    const dayWorkouts = new Map<number, { hasWorkout: boolean; effort: SessionEffort | null }>();

    for (const entry of entries) {
      if (entry.parsedMuscleTags.length === 0) continue;
      
      const entryDayStart = getStartOfDay(new Date(entry.timestamp));
      const existing = dayWorkouts.get(entryDayStart);
      
      if (!existing) {
        dayWorkouts.set(entryDayStart, {
          hasWorkout: true,
          effort: entry.sessionEffort,
        });
      } else {
        // If multiple workouts in a day, prefer higher effort
        const effortPriority: (SessionEffort | null)[] = [null, 'very_light', 'easy', 'moderate', 'hard', 'max'];
        const existingIdx = effortPriority.indexOf(existing.effort);
        const newIdx = effortPriority.indexOf(entry.sessionEffort);
        if (newIdx > existingIdx) {
          existing.effort = entry.sessionEffort;
        }
      }
    }

    // Generate last 7 days (today is rightmost)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = getStartOfDay(date);
      const isToday = dayStart === todayStart;
      const workout = dayWorkouts.get(dayStart);
      const hasWorkout = workout?.hasWorkout ?? false;
      const effort = workout?.effort ?? null;

      let color: string;
      if (isToday && !hasWorkout) {
        color = TODAY_COLOR;
      } else if (!hasWorkout) {
        color = EMPTY_COLOR;
      } else if (effort && EFFORT_COLORS[effort]) {
        color = EFFORT_COLORS[effort];
      } else {
        color = DEFAULT_WORKOUT_COLOR;
      }

      days.push({
        date,
        label: DAY_LABELS[getDayOfWeek(date)],
        isToday,
        hasWorkout,
        effort,
        color,
      });
    }

    return days;
  }, [entries]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {weekData.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <View
              style={[
                styles.box,
                { backgroundColor: day.color },
                day.isToday && !day.hasWorkout && styles.todayBox,
              ]}
            />
            <Text style={[styles.label, day.isToday && styles.todayLabel]}>
              {day.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 2,
  },
  box: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
  },
  todayBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.muted,
  },
  todayLabel: {
    color: colors.text,
    fontWeight: '600',
  },
});
