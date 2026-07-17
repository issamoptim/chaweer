export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: string;
  authProvider: string;
  status: string;
}

export interface MeUser {
  id: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface LoginResult {
  accessToken: string;
  user: AuthUser;
}

export interface RefreshResult {
  accessToken: string;
}

export interface RegisterResult {
  message: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface GoogleAuthInput {
  code: string;
  codeVerifier: string;
}

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export type AuthErrorCode =
  | "VALIDATION_ERROR"
  | "INVALID_CREDENTIALS"
  | "EMAIL_ALREADY_EXISTS"
  | "EMAIL_NOT_VERIFIED"
  | "ACCOUNT_SUSPENDED"
  | "INVALID_REFRESH_TOKEN"
  | "TOKEN_EXPIRED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "GOOGLE_AUTH_FAILED"
  | "INVALID_GOOGLE_TOKEN"
  | "PROVIDER_MISMATCH"
  | "GOOGLE_ACCOUNT_ALREADY_LINKED"
  | "GOOGLE_ACCOUNT_NOT_VERIFIED"
  | "INVALID_GOOGLE_IDENTITY"
  | "RATE_LIMIT_EXCEEDED";

export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  code: AuthErrorCode;
  message: string;
  details?: ApiErrorDetail[];
}
