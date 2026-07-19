import { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import type { ViewToken } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import type { Slide } from '../slides';

import type { StyleProp, ViewStyle } from 'react-native';

interface UseOnboardingNavigationResult {
  flatListRef: React.MutableRefObject<FlatList<Slide> | null>;
  currentIndex: number;
  ready: boolean;
  isLastSlide: boolean;
  handleReady: () => void;
  handleNext: () => void;
  onViewableItemsChanged: ({ viewableItems }: { viewableItems: ViewToken[] }) => void;
  buttonStyle: StyleProp<ViewStyle>;
  scrollEnabled: boolean;
}

export function useOnboardingNavigation(
  totalSlides: number,
  onComplete: () => void,
): UseOnboardingNavigationResult {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const buttonActivateAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<Slide>>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const index = viewableItems[0]?.index;
      if (index !== null && index !== undefined) {
        setCurrentIndex(index);
        setReady(false);
        buttonActivateAnim.setValue(0);
      }
    },
    [buttonActivateAnim],
  );

  const handleReady = useCallback(() => {
    setReady(true);
    Animated.timing(buttonActivateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [buttonActivateAnim]);

  const isLastSlide = currentIndex === totalSlides - 1;

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      if (!ready) return;
      onComplete();
      return;
    }
    flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
  }, [currentIndex, isLastSlide, ready, onComplete]);

  const buttonStyle = {
    transform: [
      {
        scale: buttonActivateAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.1, 1],
        }),
      },
    ],
  };

  return {
    flatListRef,
    currentIndex,
    ready,
    isLastSlide,
    handleReady,
    handleNext,
    onViewableItemsChanged,
    buttonStyle,
    scrollEnabled: ready,
  };
}
