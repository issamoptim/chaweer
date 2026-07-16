import 'dotenv/config';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  process.env.JWT_SECRET = 'test-jwt-secret-for-vitest-at-least-32-chars';
}
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/chaweer';
}
if (!process.env.DATABASE_TEST_URL) {
  process.env.DATABASE_TEST_URL = 'postgresql://postgres:postgres@localhost:5432/chaweer_test';
}
if (!process.env.GOOGLE_CLIENT_ID) {
  process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
}
if (!process.env.GOOGLE_REDIRECT_URI) {
  process.env.GOOGLE_REDIRECT_URI = 'postmessage';
}
