import { useCallback, memo } from 'react';
import type { ComponentType, ReactElement } from 'react';
import { View, StyleSheet, useWindowDimensions, Animated } from 'react-native';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Reanimated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/shared/theme';
import { AccentButton } from '@/shared/components';
import { AnimatedPagination } from '../components/AnimatedPagination';
import { SLIDES } from '../slides';
import type { Slide } from '../slides';
import type { SlideProps } from '../types';
import { useOnboardingNavigation } from '../hooks/useOnboardingNavigation';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const AnimatedFlatList = Reanimated.createAnimatedComponent(FlatList<Slide>);

export function OnboardingScreen({ onComplete }: OnboardingScreenProps): ReactElement {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const {
    flatListRef,
    currentIndex,
    ready,
    isLastSlide,
    handleReady,
    handleNext,
    onViewableItemsChanged,
    buttonStyle,
    scrollEnabled,
  } = useOnboardingNavigation(SLIDES.length, onComplete);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<Slide>): ReactElement => {
      const slideProps: SlideProps = {
        isActive: index === currentIndex,
        onReady: handleReady,
      };
      return (
        <View style={{ width: screenWidth, flex: 1 }}>
          <SlideWrapper Component={item.component} props={slideProps} />
        </View>
      );
    },
    [currentIndex, handleReady, screenWidth],
  );

  const label = isLastSlide ? 'Empezar' : 'Siguiente';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <AnimatedPagination count={SLIDES.length} scrollX={scrollX} slideWidth={screenWidth} />
      </View>

      <AnimatedFlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={renderItem}
      />

      <Animated.View
        style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.lg }, buttonStyle]}
      >
        <AccentButton
          label={label}
          onPress={handleNext}
          disabled={!ready}
          style={styles.bottomButton}
        />
      </Animated.View>
    </View>
  );
}

interface SlideWrapperProps {
  Component: ComponentType<SlideProps>;
  props: SlideProps;
}

const SlideWrapper = memo(function SlideWrapper({
  Component,
  props,
}: SlideWrapperProps): ReactElement {
  return <Component {...props} />;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: colors.bg,
    zIndex: 10,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    backgroundColor: colors.bg,
  },
  bottomButton: {
    width: '100%',
  },
});
