import type { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, Extrapolation } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { colors, spacing } from '@/shared/theme';

interface AnimatedPaginationProps {
  count: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

export function AnimatedPagination({
  count,
  scrollX,
  slideWidth,
}: AnimatedPaginationProps): ReactElement {
  return (
    <View style={styles.pagination}>
      {Array.from({ length: count }, (_, i) => (
        <Dash key={i} index={i} scrollX={scrollX} slideWidth={slideWidth} />
      ))}
    </View>
  );
}

interface DashProps {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

function Dash({ index, scrollX, slideWidth }: DashProps): ReactElement {
  const fillStyle = useAnimatedStyle(() => {
    // Fill left-to-right while scrolling into this slide; stay full once past it.
    const progress = interpolate(
      scrollX.value,
      [(index - 1) * slideWidth, index * slideWidth],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return { width: `${progress * 100}%` };
  });

  return (
    <View style={styles.dash}>
      <Animated.View style={[styles.dashFill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  dash: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.text.disabled,
    overflow: 'hidden',
  },
  dashFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.accent.normal,
  },
});
