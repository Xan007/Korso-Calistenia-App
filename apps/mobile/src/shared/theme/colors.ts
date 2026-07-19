export type AccentState = 'normal' | 'hiberna';

export const colors = {
  bg: '#000000',
  card: '#121212',
  border: '#333333',
  accent: {
    normal: '#FF1A1A',
    hiberna: '#0A84FF',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    disabled: '#666666',
  },
  success: '#30D158',
  warn: '#FF9F0A',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;
