import { z } from 'zod';

export const googleAuthSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  codeVerifier: z.string().min(1, 'PKCE code verifier is required'),
});

export type GoogleAuthSchema = z.infer<typeof googleAuthSchema>;
