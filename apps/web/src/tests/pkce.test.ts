import { describe, it, expect } from "vitest";
import {
  base64urlEncode,
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
} from "@/features/auth/utils/pkce";

describe("base64urlEncode", () => {
  it("encodes bytes to base64url without padding", () => {
    const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const result = base64urlEncode(bytes);
    expect(result).toBe("SGVsbG8");
    expect(result).not.toContain("=");
    expect(result).not.toContain("+");
    expect(result).not.toContain("/");
  });

  it("encodes empty input to empty string", () => {
    expect(base64urlEncode(new Uint8Array(0))).toBe("");
  });
});

describe("generateCodeVerifier", () => {
  it("returns a base64url string of at least 43 characters", () => {
    const verifier = generateCodeVerifier();
    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(verifier).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("produces unique values on subsequent calls", () => {
    const a = generateCodeVerifier();
    const b = generateCodeVerifier();
    expect(a).not.toBe(b);
  });
});

describe("generateCodeChallenge", () => {
  it("returns a base64url SHA-256 hash of the verifier", async () => {
    const verifier = "test-verifier-1234567890";
    const challenge = await generateCodeChallenge(verifier);
    expect(challenge).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(challenge).not.toContain("=");
  });

  it("returns the same challenge for the same verifier", async () => {
    const verifier = "consistent-verifier-value";
    const a = await generateCodeChallenge(verifier);
    const b = await generateCodeChallenge(verifier);
    expect(a).toBe(b);
  });

  it("returns different challenges for different verifiers", async () => {
    const a = await generateCodeChallenge("verifier-a");
    const b = await generateCodeChallenge("verifier-b");
    expect(a).not.toBe(b);
  });
});

describe("generateState", () => {
  it("returns a non-empty base64url string", () => {
    const state = generateState();
    expect(state.length).toBeGreaterThan(0);
    expect(state).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("produces unique values on subsequent calls", () => {
    const a = generateState();
    const b = generateState();
    expect(a).not.toBe(b);
  });
});
