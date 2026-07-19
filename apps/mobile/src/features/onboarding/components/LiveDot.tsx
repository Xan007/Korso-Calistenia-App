import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { colors, radius } from '@/shared/theme';

export function LiveDot({ playing }: { playing: boolean }): ReactElement {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!playing) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.25, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return (): void => loop.stop();
  }, [playing, pulse]);

  return <Animated.View style={[styles.liveDot, { opacity: pulse }]} />;
}

const styles = StyleSheet.create({
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.normal,
  },
});
