import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Animated, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/shared/theme';

interface AuthTextFieldProps extends Omit<TextInputProps, 'style' | 'placeholder'> {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  error?: string;
  secure?: boolean;
}

export const AuthTextField = forwardRef<TextInput, AuthTextFieldProps>(function AuthTextField(
  { label, icon, error, secure = false, value, onFocus, onBlur, ...inputProps },
  ref,
): ReactElement {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);
  const floatAnim = useRef(new Animated.Value(0)).current;
  const hasValue = (value?.length ?? 0) > 0;
  const floated = focused || hasValue;

  useEffect(() => {
    Animated.timing(floatAnim, {
      toValue: floated ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [floated, floatAnim]);

  const labelStyle = {
    top: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [17, 7] }),
    fontSize: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 11] }),
    color: floatAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.text.disabled, focused ? colors.accent.normal : colors.text.secondary],
    }),
  };

  const borderColor = error
    ? colors.accent.normal
    : focused
      ? colors.text.secondary
      : colors.border;

  return (
    <View>
      <View style={[styles.field, { borderColor }]}>
        <Feather
          name={icon}
          size={18}
          color={focused ? colors.text.primary : colors.text.disabled}
          style={styles.icon}
        />
        <View style={styles.inputArea}>
          <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
            {label}
          </Animated.Text>
          <TextInput
            ref={ref}
            {...inputProps}
            value={value}
            secureTextEntry={hidden}
            style={styles.input}
            cursorColor={colors.accent.normal}
            selectionColor={colors.accent.normal}
            placeholderTextColor={colors.text.disabled}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
          />
        </View>
        {secure && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
          >
            <Feather name={hidden ? 'eye' : 'eye-off'} size={18} color={colors.text.disabled} />
          </Pressable>
        )}
      </View>
      {error !== undefined && (
        <View style={styles.errorRow}>
          <Feather name="alert-circle" size={12} color={colors.accent.normal} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 58,
    paddingHorizontal: spacing.base,
  },
  icon: {
    marginRight: spacing.md,
  },
  inputArea: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  label: {
    position: 'absolute',
    left: 0,
    fontFamily: 'Inter_500Medium',
  },
  input: {
    ...typography.body,
    color: colors.text.primary,
    paddingBottom: 8,
    paddingTop: 0,
    height: 34,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  errorText: {
    ...typography.micro,
    color: colors.accent.normal,
  },
});
