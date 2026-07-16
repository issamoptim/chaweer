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
