import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/shared/theme';

interface StreakBadgeProps {
  count: number;
  protected?: boolean;
}

export function StreakBadge({ count, protected: isProtected = false }: StreakBadgeProps): ReactElement {
  const accent = isProtected ? colors.accent.hiberna : colors.accent.normal;
  return (
    <View style={styles.wrap}>
      <View style={[styles.circle, { backgroundColor: accent, shadowColor: accent }]}>
        <Text style={styles.number}>{count}</Text>
      </View>
      <Text style={[styles.label, { color: accent }]}>
        {isProtected ? 'Racha protegida' : 'Racha'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  number: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: 'Sora_800ExtraBold',
    color: colors.text.primary,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
