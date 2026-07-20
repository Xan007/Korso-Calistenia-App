import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/shared/theme';
import { StreakBadge } from '../components/StreakBadge';
import { ParqueRadioCard } from '../components/ParqueRadioCard';
import { CheckinCard } from '../components/CheckinCard';

interface ParqueScreenProps {
  nickname: string;
}

export function ParqueScreen({ nickname }: ParqueScreenProps): ReactElement {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const enterStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.base }]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={enterStyle}>
        <View style={styles.headerRow}>
          <View style={styles.greeting}>
            <Text style={styles.hello}>Hola, {nickname} 👋</Text>
            <Text style={styles.subtitle}>Listo para el parque hoy?</Text>
          </View>
          <StreakBadge count={12} />
        </View>

        <View style={styles.section}>
          <ParqueRadioCard
            title="Ep. 28 · Habitos que resisten los parciales"
            subtitle="Resumen de 1 min a las 8 PM"
            listeners={247}
            live
            onPress={() => {}}
          />
        </View>

        <View style={styles.section}>
          <CheckinCard
            spotName="Parque Centenario"
            description="Tu spot favorito te espera. El check-in cuenta desde las 6 AM."
            onCheckin={() => {}}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  greeting: {
    flex: 1,
    paddingRight: spacing.base,
  },
  hello: {
    ...typography.display,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.md,
  },
});
