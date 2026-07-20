import type { ReactElement } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/shared/theme';

interface GoogleButtonProps {
  label: string;
  onPress: () => void;
}

// Follows Google's dark-theme branding: #131314 surface, #8E918F stroke.
// TODO: swap the glyph for the official multicolor "G" asset before shipping.
export function GoogleButton({ label, onPress }: GoogleButtonProps): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <AntDesign name="google" size={18} color={colors.text.primary} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: '#131314',
    borderWidth: 1,
    borderColor: '#3A3B3C',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...typography.button,
    color: colors.text.primary,
  },
});
