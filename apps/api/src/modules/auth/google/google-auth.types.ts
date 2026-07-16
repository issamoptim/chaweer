export interface GoogleClaims {
  sub: string;
  email: string;
  emailVerified: boolean;
  givenName: string;
  familyName: string;
  picture: string | null;
}

export interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface GoogleAuthInput {
  code: string;
  codeVerifier: string;
}
