import { useRef } from 'react';
import type { ReactElement } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/shared/theme';
import type { SlideProps } from '../types';
import { useSlideEntrance } from '../hooks/useSlideEntrance';

const ICON_BOX = 80;

export function ScheduleSlide({ isActive, onReady }: SlideProps): ReactElement {
  const diagramAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useSlideEntrance(isActive, onReady, diagramAnim, contentAnim);

  const diagramStyle = {
    opacity: diagramAnim,
    transform: [{ scale: diagramAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
  };

  const contentStyle = {
    opacity: contentAnim,
    transform: [
      { translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.diagram, diagramStyle]}>
        <View style={styles.iconBox}>
          <Feather name="camera" size={32} color={colors.accent.normal} />
        </View>
        <Feather name="arrow-right" size={20} color={colors.text.disabled} />
        <View style={styles.iconBox}>
          <Feather name="calendar" size={32} color={colors.accent.normal} />
        </View>
      </Animated.View>

      <Animated.Text style={[styles.headline, contentStyle]}>Importa tu horario</Animated.Text>

      <Animated.View style={[styles.card, contentStyle]}>
        <Text style={styles.cardTitle}>Como funciona</Text>
        <View style={styles.cardRow}>
          <Feather name="camera" size={16} color={colors.accent.normal} />
          <Text style={styles.cardText}>Foto a tu horario</Text>
        </View>
        <View style={styles.cardRow}>
          <Feather name="calendar" size={16} color={colors.accent.normal} />
          <Text style={styles.cardText}>Korso lee tu horario automáticamente</Text>
        </View>
        <View style={styles.cardRow}>
          <Feather name="shield" size={16} color={colors.accent.normal} />
          <Text style={styles.cardText}>En la semana de examenes protege tu racha</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  diagram: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['3xl'],
    gap: spacing.md,
  },
  iconBox: {
    width: ICON_BOX,
    height: ICON_BOX,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    ...typography.display,
    color: colors.text.primary,
    marginBottom: spacing['2xl'],
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.base,
  },
  cardTitle: {
    ...typography.title,
    color: colors.text.primary,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardText: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
  },
});
