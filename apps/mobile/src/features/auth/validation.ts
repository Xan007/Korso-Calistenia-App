import type { AuthErrors, AuthMode, AuthValues } from './types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NICKNAME_MIN = 3;
export const PASSWORD_MIN = 8;

export function validateAuth(mode: AuthMode, values: AuthValues): AuthErrors {
  const errors: AuthErrors = {};

  if (mode === 'register') {
    const nickname = values.nickname.trim();
    if (nickname.length === 0) {
      errors.nickname = 'Elige un nickname';
    } else if (nickname.length < NICKNAME_MIN) {
      errors.nickname = `Minimo ${NICKNAME_MIN} caracteres`;
    }
  }

  const email = values.email.trim();
  if (email.length === 0) {
    errors.email = 'Escribe tu email';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Ese email no parece valido';
  }

  if (values.password.length === 0) {
    errors.password = 'Escribe tu contraseña';
  } else if (mode === 'register' && values.password.length < PASSWORD_MIN) {
    errors.password = `Minimo ${PASSWORD_MIN} caracteres`;
  }

  return errors;
}
