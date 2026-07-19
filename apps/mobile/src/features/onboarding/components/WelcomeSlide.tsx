import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme';
import type { SlideProps } from '../types';
import logo from '@assets/logo.png';
import { useSlideEntrance } from '../hooks/useSlideEntrance';

export function WelcomeSlide({ isActive, onReady }: SlideProps): ReactElement {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;

  useSlideEntrance(isActive, onReady, logoAnim, textAnim);

  useEffect(() => {
    if (isActive) {
      taglineAnim.setValue(0);
      Animated.timing(taglineAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    } else {
      taglineAnim.setValue(0);
    }
  }, [isActive, taglineAnim]);

  const logoStyle = {
    opacity: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
    transform: [{ scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }],
  };

  const textStyle = {
    opacity: textAnim,
    transform: [{ translateY: textAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
  };

  const taglineStyle = {
    opacity: taglineAnim,
    transform: [
      { translateY: taglineAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={logoStyle}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Animated.Text style={[styles.logoText, textStyle]}>KORSO</Animated.Text>
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        Hecho para universitarios.{'\n'}Constancia y fuerza.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoText: {
    fontSize: 48,
    letterSpacing: 6,
    fontFamily: 'Sora_800ExtraBold',
    color: colors.accent.normal,
    marginBottom: spacing.base,
  },
  tagline: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
