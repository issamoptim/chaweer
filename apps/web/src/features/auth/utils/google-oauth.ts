import { generateCodeChallenge, generateCodeVerifier, generateState } from "./pkce";
import { saveOAuthState } from "./oauth-storage";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const SCOPES = "openid email profile";
const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;

export async function initiateGoogleLogin(from: string = "/"): Promise<void> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  saveOAuthState({ codeVerifier, state, from });

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
    prompt: "select_account",
  });

  window.location.assign(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}
