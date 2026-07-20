export type AuthMode = 'login' | 'register';

export interface AuthValues {
  nickname: string;
  email: string;
  password: string;
}

export type AuthField = keyof AuthValues;

export type AuthErrors = Partial<Record<AuthField, string>>;
