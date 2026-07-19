import type { ReactElement } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '@/shared/theme';

export function Waveform({ values }: { values: Animated.Value[] }): ReactElement {
  return (
    <View style={styles.waveform}>
      {values.map((v, i) => (
        <WaveformBar key={i} value={v} />
      ))}
    </View>
  );
}

function WaveformBar({ value }: { value: Animated.Value }): ReactElement {
  const scaleY = value.interpolate({
    inputRange: [0, 1],
    outputRange: [0.01, 1.5],
  });

  return (
    <View style={styles.waveformBarSlot}>
      <Animated.View
        style={[
          styles.waveformBar,
          {
            backgroundColor: colors.accent.normal,
            transform: [{ scaleY }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
  },
  waveformBarSlot: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  waveformBar: {
    width: 3,
    height: '100%',
    borderRadius: 2,
  },
});
