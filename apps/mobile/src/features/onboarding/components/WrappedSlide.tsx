import { useEffect, useMemo, useRef } from 'react';
import type { ReactElement } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/shared/theme';
import { audioManager } from '@/shared/audio/AudioManager';
import { useWaveformPlayer, WAVEFORM_BIN_COUNT } from '@/shared/audio/useWaveformPlayer';
import type { SlideProps } from '../types';
import { useSlideEntrance } from '../hooks/useSlideEntrance';
import { Waveform } from './Waveform';
import { LiveDot } from './LiveDot';
import { useCountUp } from '@/shared/hooks';
import { formatTime } from '@/shared/utils/formatTime';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const audioSource = require('@assets/onboarding_parque_radio.wav');

const VIZ_BAR_COUNT = 24;
const VIZ_BIN_RANGE = 64;

function makeIdleHeight(i: number): number {
  return 0.18 + ((i * 37) % 50) / 100;
}

export function WrappedSlide({ onFinished, isActive = false, onReady }: SlideProps): ReactElement {
  const { loaded, playing, duration, currentTime, toggle, pause, readFrequencyData } =
    useWaveformPlayer(audioSource, { onFinished });

  const stamp = useRef(new Animated.Value(0)).current;
  const radioIn = useRef(new Animated.Value(0)).current;

  useSlideEntrance(isActive, onReady, stamp, radioIn);

  const started = playing || currentTime > 0;

  const barAnimRefs = useRef<(Animated.CompositeAnimation | null)[]>(
    Array.from({ length: VIZ_BAR_COUNT }, () => null),
  ).current;
  const barValues = useMemo(
    () => Array.from({ length: VIZ_BAR_COUNT }, (_, i) => new Animated.Value(makeIdleHeight(i))),
    [],
  );

  const freqRef = useRef<Uint8Array>(new Uint8Array(WAVEFORM_BIN_COUNT));

  const checkins = useCountUp(12, isActive, 350);
  const streak = useCountUp(5, isActive, 500);
  const friends = useCountUp(3, isActive, 650);

  useEffect(() => {
    audioManager.configure();
  }, []);

  useEffect(() => {
    if (!isActive && playing) {
      pause();
    }
  }, [isActive, playing, pause]);

  useEffect(() => {
    if (!loaded) return;
    if (!playing) {
      Animated.parallel(
        barValues.map((v, i) =>
          Animated.timing(v, {
            toValue: makeIdleHeight(i),
            duration: 200,
            useNativeDriver: true,
          }),
        ),
      ).start();
      return;
    }
    let running = true;
    const tick = (): void => {
      if (!running) return;
      readFrequencyData(freqRef.current);
      const data = freqRef.current;
      const step = Math.max(1, Math.floor(VIZ_BIN_RANGE / VIZ_BAR_COUNT));
      for (let i = 0; i < VIZ_BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += data[i * step + j] ?? 0;
        }
        const avg = sum / step / 255;
        barAnimRefs[i]?.stop();
        const timing = Animated.timing(barValues[i], {
          toValue: avg,
          duration: 50,
          useNativeDriver: true,
        });
        barAnimRefs[i] = timing;
        timing.start();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return (): void => {
      running = false;
    };
  }, [loaded, playing, readFrequencyData]);

  const stampStyle = {
    opacity: stamp.interpolate({ inputRange: [0, 0.3], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [
      { scale: stamp.interpolate({ inputRange: [0, 1], outputRange: [2.1, 1] }) },
      { rotate: stamp.interpolate({ inputRange: [0, 1], outputRange: ['7deg', '-2deg'] }) },
    ],
  };

  const radioStyle = {
    opacity: radioIn,
    transform: [{ translateY: radioIn.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }],
  };

  const pillLabel = playing ? 'Pausar' : started ? 'Seguir escuchando' : 'Escuchar el episodio';

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>Tu semana, estilo Wrapped</Text>

      <Animated.View style={[styles.heroCard, stampStyle]}>
        <Text style={styles.heroLabel}>Tu semana en numeros</Text>
        <View style={styles.statsRow}>
          <Stat number={checkins} label="check-ins" />
          <View style={styles.statDivider} />
          <Stat number={streak} label="dias racha" />
          <View style={styles.statDivider} />
          <Stat number={friends} label="amigos" />
        </View>
      </Animated.View>

      <Animated.View style={radioStyle}>
        <Pressable onPress={toggle} style={styles.radioCard}>
          <View style={styles.radioHeader}>
            <View style={styles.stationBadge}>
              <LiveDot playing={playing} />
              <Text style={styles.stationName}>Parque Radio</Text>
            </View>
            {loaded && (
              <Text style={styles.time}>
                {formatTime(currentTime)}
                <Text style={styles.timeDim}> / {formatTime(duration)}</Text>
              </Text>
            )}
          </View>

          <Waveform values={barValues} />

          <View style={[styles.pill, playing && styles.pillPlaying]}>
            <Feather
              name={playing ? 'pause' : 'play'}
              size={14}
              color={playing ? colors.text.primary : colors.bg}
            />
            <Text style={[styles.pillText, playing && styles.pillTextPlaying]}>{pillLabel}</Text>
          </View>

          <Text style={styles.radioCaption}>
            El episodio de la semana, hecho por todo el parque
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

function Stat({ number, label }: { number: number; label: string }): ReactElement {
  return (
    <View style={styles.statCol}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  headline: {
    ...typography.display,
    color: colors.text.primary,
    marginBottom: spacing['2xl'],
  },
  heroCard: {
    backgroundColor: colors.accent.normal,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing['2xl'],
    shadowColor: colors.accent.normal,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  heroLabel: {
    ...typography.micro,
    color: colors.bg,
    marginBottom: spacing.base,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: 'Inter_700Bold',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 44,
    fontFamily: 'Sora_800ExtraBold',
    color: colors.text.primary,
    lineHeight: 52,
  },
  statLabel: {
    ...typography.micro,
    color: colors.bg,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Inter_600SemiBold',
  },
  statDivider: {
    width: 1,
    height: 44,
    backgroundColor: colors.bg,
    opacity: 0.25,
  },
  radioCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.base,
  },
  radioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stationName: {
    ...typography.title,
    color: colors.text.primary,
  },
  time: {
    ...typography.caption,
    color: colors.text.secondary,
    fontFamily: 'Inter_500Medium',
  },
  timeDim: {
    color: colors.text.disabled,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    alignSelf: 'center',
    backgroundColor: colors.accent.normal,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  pillPlaying: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    ...typography.micro,
    fontFamily: 'Inter_600SemiBold',
    color: colors.bg,
  },
  pillTextPlaying: {
    color: colors.text.primary,
  },
  radioCaption: {
    ...typography.caption,
    color: colors.text.disabled,
    textAlign: 'center',
  },
});
