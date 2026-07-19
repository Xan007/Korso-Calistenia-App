import { useEffect } from 'react';
import { Animated } from 'react-native';

export function useSlideEntrance(
  isActive: boolean | undefined,
  onReady: (() => void) | undefined,
  springValue: Animated.Value,
  timingValue: Animated.Value,
): void {
  useEffect(() => {
    if (isActive) {
      springValue.setValue(0);
      timingValue.setValue(0);
      Animated.sequence([
        Animated.spring(springValue, {
          toValue: 1,
          damping: 12,
          stiffness: 260,
          mass: 0.5,
          useNativeDriver: true,
        }),
        Animated.spring(timingValue, {
          toValue: 1,
          damping: 12,
          stiffness: 260,
          mass: 0.5,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) onReady?.();
      });
    } else {
      springValue.setValue(0);
      timingValue.setValue(0);
    }
  }, [isActive, springValue, timingValue, onReady]);
}
