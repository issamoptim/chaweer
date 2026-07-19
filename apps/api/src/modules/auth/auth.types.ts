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

export interface LoginResult {
  accessToken: string;
  user: AuthUser;
}

export interface RefreshResult {
  accessToken: string;
}

export interface MeUser {
  id: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  authProvider: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
