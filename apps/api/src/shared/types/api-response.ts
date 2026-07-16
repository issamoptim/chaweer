export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

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

export interface LoginData {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterData {
  message: string;
}

export interface RefreshData {
  accessToken: string;
}
