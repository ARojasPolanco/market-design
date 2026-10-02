import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  APP_URL: z.string().url().optional(),
  DB_URI: z.string().url(),
  TEST_DB_URI: z.string().url().optional(),
  SECRET_JWT_SEED: z.string().min(32),
  JWT_EXPIRE_IN: z.string().default('1d'),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().optional(),
  R2_PUBLIC_URL: z.string().optional(),
  MP_ACCESS_TOKEN: z.string().optional(),
  MP_PUBLIC_KEY: z.string().optional(),
  MP_WEBHOOK_SECRET: z.string().optional(),
  MP_CLIENT_ID: z.string().optional(),
  MP_CLIENT_SECRET: z.string().optional(),
  API_PUBLIC_URL: z.string().url().optional(),
  HCAPTCHA_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  OWNER_EMAIL: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  console.error(_env.error.format());
  process.exit(1);
}

export const envs = _env.data;

// Canonical public URL of the web app, used to build links in emails and redirects.
// Falls back to the first allowed CORS origin if APP_URL is not set.
export const appUrl = envs.APP_URL || envs.CORS_ORIGIN.split(',')[0].trim();
