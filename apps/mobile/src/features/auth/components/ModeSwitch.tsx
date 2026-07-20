import { useRef } from 'react';
import type { ReactElement } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { colors, radius, typography } from '@/shared/theme';
import type { AuthMode } from '../types';

interface ModeSwitchProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
  width: number;
}

export function ModeSwitch({ mode, onChange, width }: ModeSwitchProps): ReactElement {
  const anim = useRef(new Animated.Value(mode === 'login' ? 0 : 1)).current;
  const segmentWidth = (width - PADDING * 2) / 2;

  const select = (next: AuthMode): void => {
    if (next === mode) return;
    Animated.spring(anim, {
      toValue: next === 'login' ? 0 : 1,
      damping: 20,
      stiffness: 260,
      mass: 0.7,
      useNativeDriver: true,
    }).start();
    onChange(next);
  };

  const thumbStyle = {
    width: segmentWidth,
    transform: [
      {
        translateX: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, segmentWidth],
        }),
      },
    ],
  };

  return (
    <View style={[styles.track, { width }]}>
      <Animated.View style={[styles.thumb, thumbStyle]} />
      <Pressable style={styles.segment} onPress={() => select('login')} accessibilityRole="tab">
        <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>
          Iniciar sesion
        </Text>
      </Pressable>
      <Pressable style={styles.segment} onPress={() => select('register')} accessibilityRole="tab">
        <Text style={[styles.segmentText, mode === 'register' && styles.segmentTextActive]}>
          Crear cuenta
        </Text>
      </Pressable>
    </View>
  );
}

const PADDING = 4;

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    padding: PADDING,
    alignSelf: 'center',
  },
  thumb: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.normal,
  },
  segment: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    ...typography.micro,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: colors.text.secondary,
  },
  segmentTextActive: {
    color: colors.text.primary,
  },
});
