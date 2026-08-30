export const colors = {
  bg: '#FFFFFF',
  text: '#000000',
  muted: '#9CA3AF',
  border: '#000000',
  bubbleUser: '#000000',
  bubbleUserText: '#FFFFFF',
  bubbleAssistant: '#FFFFFF',
  bubbleAssistantText: '#000000',
  inputBg: '#F3F4F6',
  inputPlaceholder: '#9CA3AF',
  toggleInactive: '#D1D5DB',
  // Fatigue scale — ONLY used on body map + legend
  fresh: '#4ADE80',
  recovering: '#FACC15',
  tired: '#FB923C',
  fatigued: '#EF4444',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
  header: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
};
