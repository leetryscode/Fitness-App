import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';

type Props = {
  onSettingsPress: () => void;
};

function formatHeaderDate(date: Date): string {
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) {
    return `TODAY, ${time}`;
  }

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  return `${dateStr.toUpperCase()}, ${time}`;
}

export function Header({ onSettingsPress }: Props) {
  const [label, setLabel] = React.useState(formatHeaderDate(new Date()));

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLabel(formatHeaderDate(new Date()));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.mascot}>
        <View style={styles.mascotInner} />
      </View>

      <Text style={styles.timestamp}>{label}</Text>

      <Pressable onPress={onSettingsPress} hitSlop={12} style={styles.gearBtn}>
        <Text style={styles.gear}>⚙</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mascot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.muted,
  },
  timestamp: {
    ...typography.header,
    color: colors.text,
    textTransform: 'uppercase',
  },
  gearBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gear: {
    fontSize: 22,
    color: colors.text,
  },
});
