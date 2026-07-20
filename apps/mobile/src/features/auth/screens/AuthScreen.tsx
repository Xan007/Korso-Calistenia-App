import { useCallback, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/shared/theme';
import { AccentButton } from '@/shared/components';
import logo from '@assets/logo.png';
import { AuthTextField } from '../components/AuthTextField';
import { GoogleButton } from '../components/GoogleButton';
import { ModeSwitch } from '../components/ModeSwitch';
import type { AuthErrors, AuthMode, AuthValues } from '../types';
import { validateAuth } from '../validation';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

const EMPTY_VALUES: AuthValues = { nickname: '', email: '', password: '' };

export function AuthScreen({ onAuthenticated }: AuthScreenProps): ReactElement {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [mode, setMode] = useState<AuthMode>('login');
  const [values, setValues] = useState<AuthValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<AuthErrors>({});

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const nicknameAnim = useRef(new Animated.Value(0)).current;
  const formFade = useRef(new Animated.Value(1)).current;

  const isRegister = mode === 'register';

  const switchMode = useCallback(
    (next: AuthMode) => {
      setMode(next);
      setErrors({});
      Animated.parallel([
        Animated.timing(nicknameAnim, {
          toValue: next === 'register' ? 1 : 0,
          duration: 220,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(formFade, { toValue: 0.4, duration: 90, useNativeDriver: true }),
          Animated.timing(formFade, { toValue: 1, duration: 160, useNativeDriver: true }),
        ]),
      ]).start();
    },
    [nicknameAnim, formFade],
  );

  const setField = useCallback((field: keyof AuthValues, text: string) => {
    setValues((v) => ({ ...v, [field]: text }));
    setErrors((e) => (e[field] !== undefined ? { ...e, [field]: undefined } : e));
  }, []);

  const handleSubmit = useCallback(() => {
    Keyboard.dismiss();
    const nextErrors = validateAuth(mode, values);
    setErrors(nextErrors);
    if (Object.values(nextErrors).every((e) => e === undefined)) {
      onAuthenticated();
    }
  }, [mode, values, onAuthenticated]);

  const nicknameContainerStyle = {
    opacity: nicknameAnim,
    maxHeight: nicknameAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 90] }),
    marginBottom: nicknameAnim.interpolate({ inputRange: [0, 1], outputRange: [0, spacing.base] }),
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing['2xl'], paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brand}>KORSO</Text>
          <Text style={styles.subtitle}>
            {isRegister ? 'Crea tu cuenta y empieza hoy' : 'Que bueno verte de nuevo'}
          </Text>
        </View>

        <ModeSwitch mode={mode} onChange={switchMode} width={screenWidth - spacing.xl * 2} />

        <Animated.View style={[styles.form, { opacity: formFade }]}>
          <Animated.View style={[styles.nicknameWrap, nicknameContainerStyle]}>
            <AuthTextField
              label="Nickname"
              icon="user"
              value={values.nickname}
              onChangeText={(t) => setField('nickname', t)}
              error={errors.nickname}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              editable={isRegister}
            />
          </Animated.View>

          <View style={styles.fieldGap}>
            <AuthTextField
              ref={emailRef}
              label="Email"
              icon="mail"
              value={values.email}
              onChangeText={(t) => setField('email', t)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          </View>

          <AuthTextField
            ref={passwordRef}
            label="Contraseña"
            icon="lock"
            value={values.password}
            onChangeText={(t) => setField('password', t)}
            error={errors.password}
            secure
            autoCapitalize="none"
            autoComplete={isRegister ? 'new-password' : 'current-password'}
            textContentType={isRegister ? 'newPassword' : 'password'}
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
          />

          {!isRegister && (
            <Pressable
              style={styles.forgot}
              hitSlop={8}
              accessibilityRole="button"
              onPress={() => {}}
            >
              <Text style={styles.forgotText}>Olvidaste tu contraseña?</Text>
            </Pressable>
          )}

          <AccentButton
            label={isRegister ? 'Crear cuenta' : 'Entrar'}
            onPress={handleSubmit}
            style={styles.submit}
          />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o continua con</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleButton
            label={isRegister ? 'Registrarse con Google' : 'Iniciar sesion con Google'}
            onPress={() => {}}
          />
        </Animated.View>

        <Text style={styles.legal}>
          Al continuar aceptas los <Text style={styles.legalLink}>Terminos</Text> y la{' '}
          <Text style={styles.legalLink}>Politica de privacidad</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: spacing.sm,
  },
  brand: {
    fontSize: 32,
    letterSpacing: 5,
    fontFamily: 'Sora_800ExtraBold',
    color: colors.accent.normal,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  form: {
    marginTop: spacing['2xl'],
  },
  nicknameWrap: {
    overflow: 'hidden',
  },
  fieldGap: {
    marginBottom: spacing.base,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: spacing.md,
  },
  forgotText: {
    ...typography.micro,
    fontSize: 13,
    color: colors.text.secondary,
  },
  submit: {
    marginTop: spacing.xl,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.micro,
    color: colors.text.disabled,
  },
  legal: {
    ...typography.micro,
    color: colors.text.disabled,
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: spacing['2xl'],
    lineHeight: 18,
  },
  legalLink: {
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});
