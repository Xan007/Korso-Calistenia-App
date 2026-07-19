import { useRef } from 'react';
import type { ReactElement } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/shared/theme';
import type { SlideProps } from '../types';
import { useSlideEntrance } from '../hooks/useSlideEntrance';

const CIRCLE = 100;

export function GeofencingSlide({ isActive, onReady }: SlideProps): ReactElement {
  const iconAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useSlideEntrance(isActive, onReady, iconAnim, contentAnim);

  const iconScale = iconAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const ring1Scale = iconAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const ring2Scale = iconAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  const iconStyle = {
    opacity: iconAnim,
    transform: [{ scale: iconScale }],
  };

  const ring1Opacity = iconAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 0.3],
  });

  const ring2Opacity = iconAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 0.15],
  });

  const contentStyle = {
    opacity: contentAnim,
    transform: [
      { translateY: contentAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconCircle, iconStyle]}>
        <Feather name="map-pin" size={24} color={colors.accent.normal} />
        <Animated.View
          style={[
            styles.ring,
            { width: 76, height: 76, borderRadius: 38, opacity: ring1Opacity },
            { transform: [{ scale: ring1Scale }] },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            { width: 92, height: 92, borderRadius: 46, opacity: ring2Opacity },
            { transform: [{ scale: ring2Scale }] },
          ]}
        />
      </Animated.View>

      <Animated.Text style={[styles.headline, contentStyle]}>
        Sabe cuando hay gente en el parque
      </Animated.Text>

      <Animated.View style={[styles.card, contentStyle]}>
        <Text style={styles.cardTitle}>Como funciona</Text>
        <View style={styles.cardRow}>
          <Feather name="map-pin" size={16} color={colors.accent.normal} />
          <Text style={styles.cardText}>Detecta que estás en el parque</Text>
        </View>
        <View style={styles.cardRow}>
          <Feather name="bell" size={16} color={colors.accent.normal} />
          <Text style={styles.cardText}>Te notifica si hay gente en el parque</Text>
        </View>
        <View style={styles.cardRow}>
          <Feather name="check-circle" size={16} color={colors.accent.normal} />
          <Text style={styles.cardText}>Decides si sumarte</Text>
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
  iconCircle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing['3xl'],
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: colors.accent.normal,
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
