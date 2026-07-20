import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/shared/theme';
import { LiveDot } from '@/features/onboarding/components/LiveDot';

interface ParqueRadioCardProps {
  title: string;
  subtitle: string;
  listeners?: number;
  live?: boolean;
  onPress: () => void;
}

export function ParqueRadioCard({
  title,
  subtitle,
  listeners,
  live = false,
  onPress,
}: ParqueRadioCardProps): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconBox}>
        <Feather name="radio" size={24} color={colors.accent.normal} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Parque Radio</Text>
          {live && (
            <View style={styles.liveBadge}>
              <LiveDot playing />
              <Text style={styles.liveText}>EN VIVO</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.meta}>
          {listeners !== undefined ? `${listeners} escuchando ahora` : subtitle}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.accent.normal} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    backgroundColor: '#1A0505',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#3D0F0F',
    padding: spacing.base,
  },
  pressed: {
    opacity: 0.85,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 26, 26, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    fontSize: 16,
    color: colors.text.primary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 26, 26, 0.15)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  liveText: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'Inter_700Bold',
    color: colors.accent.normal,
    letterSpacing: 0.5,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  meta: {
    ...typography.micro,
    color: colors.accent.normal,
  },
});
