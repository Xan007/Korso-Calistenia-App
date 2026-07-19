import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '@/shared/theme';

export function AnimatedPagination({
  count,
  activeIndex,
}: {
  count: number;
  activeIndex: number;
}): ReactElement {
  const anims = useRef<Animated.Value[]>([]);

  if (anims.current.length !== count) {
    anims.current = Array.from({ length: count }, (_, i) => new Animated.Value(i === 0 ? 1 : 0));
  }

  useEffect(() => {
    anims.current.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === activeIndex ? 1 : 0,
        duration: 350,
        useNativeDriver: false,
      }).start();
    });
  }, [activeIndex]);

  return (
    <View style={styles.pagination}>
      {anims.current.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.paginationDash,
            {
              backgroundColor: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [colors.text.disabled, colors.accent.normal],
              }),
            },
          ]}
        />
      ))}
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
  paginationDash: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
});
