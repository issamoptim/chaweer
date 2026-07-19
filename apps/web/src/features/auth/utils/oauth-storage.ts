export interface OAuthState {
  codeVerifier: string;
  state: string;
  from: string;
  reactivate?: boolean;
}

const STORAGE_KEY = "google_pkce";

export function saveOAuthState(data: OAuthState): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getOAuthState(): OAuthState | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OAuthState;
  } catch {
    return null;
  }
}

export function clearOAuthState(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
