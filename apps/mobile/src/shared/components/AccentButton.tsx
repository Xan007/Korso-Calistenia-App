import type { ReactElement } from 'react';
import { Text, StyleSheet, ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { colors, radius, typography, spacing } from '@/shared/theme';
import type { AccentState } from '../theme';

interface AccentButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  accent?: AccentState;
  style?: StyleProp<ViewStyle>;
}

export function AccentButton({
  label,
  onPress,
  loading,
  disabled,
  accent = 'normal',
  style,
}: AccentButtonProps): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.accent[accent] },
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text.primary} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.md,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  label: {
    ...typography.button,
    color: colors.text.primary,
  },
});
