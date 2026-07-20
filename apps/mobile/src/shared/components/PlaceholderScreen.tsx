import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/shared/theme';

interface PlaceholderScreenProps {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  caption: string;
}

export function PlaceholderScreen({ title, icon, caption }: PlaceholderScreenProps): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.base }]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.empty}>
        <Feather name={icon} size={32} color={colors.text.disabled} />
        <Text style={styles.caption}>{caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.base,
  },
  title: {
    ...typography.display,
    color: colors.text.primary,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingBottom: spacing['5xl'],
  },
  caption: {
    ...typography.body,
    color: colors.text.disabled,
    textAlign: 'center',
  },
});
