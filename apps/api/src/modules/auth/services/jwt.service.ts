import { SignJWT, jwtVerify } from 'jose';
import { env } from '../../../config/env';

const secret = new TextEncoder().encode(env.JWT_SECRET);
const algorithm = 'HS256';

export interface JwtPayload {
  userId: string;
  role: string;
}

export async function signAccessToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setSubject(payload.userId)
    .setIssuer(env.JWT_ISSUER)
    .setExpirationTime(env.JWT_ACCESS_EXPIRES_IN)
    .sign(secret);
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, secret, {
    issuer: env.JWT_ISSUER,
  });
  return {
    userId: (payload.sub ?? payload.userId) as string,
    role: payload.role as string,
  };
}
