import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const DEFAULT_DATABASE_URL =
  "postgres://postgres.oaiyaqqxaqqwlqnoquip:m35AG2qZ1JRKdxnd@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
const DEFAULT_DIRECT_URL =
  "postgresql://postgres.oaiyaqqxaqqwlqnoquip:m35AG2qZ1JRKdxnd@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";
const DEFAULT_SUPABASE_URL = "https://oaiyaqqxaqqwlqnoquip.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9haXlhcXF4YXFxd2xxbm9xdWlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzUwMjQsImV4cCI6MjEwNzgxMTAyNH0.PRuebgPY9W0hxWbIezAvc2zRwkmJqki1WowmApYhFs4";
const DEFAULT_SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9haXlhcXF4YXFxd2xxbm9xdWlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjIzNTAyNCwiZXhwIjoyMTA3ODExMDI0fQ.CfiGArkfYHBMrfVFQgQqpBCwPGaxWP3-EigQM0HixSc";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .min(1)
      .default(DEFAULT_DATABASE_URL),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    SUPABASE_SERVICE_KEY: z.string().min(1).default(DEFAULT_SUPABASE_SERVICE_KEY),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    DIRECT_URL: z.string().min(1).default(DEFAULT_DIRECT_URL),
    LEMON_SQUEEZY_API_KEY: z.string().optional(),
    LEMONS_SQUEEZY_SIGNATURE_SECRET: z.string().optional(),
    LEMON_SQUEEZY_STORE_ID: z.string().optional(),
    LEMON_SQUEEZY_SUBSCRIPTION_VARIANT_ID: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    MAILGUN_API_KEY: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.string().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().min(1).default(DEFAULT_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default(DEFAULT_SUPABASE_ANON_KEY),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
    NEXT_PUBLIC_UMAMI_URL: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL:
      process.env.DATABASE_URL ??
      process.env.POSTGRES_PRISMA_URL ??
      process.env.POSTGRES_URL_NON_POOLING ??
      process.env.POSTGRES_URL ??
      DEFAULT_DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    DIRECT_URL:
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      DEFAULT_DIRECT_URL,
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      process.env.SUPABASE_URL ??
      DEFAULT_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_KEY ??
      process.env.SUPABASE_ANON_KEY ??
      DEFAULT_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY:
      process.env.SUPABASE_SERVICE_KEY ??
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      DEFAULT_SUPABASE_SERVICE_KEY,
    SUPABASE_SERVICE_ROLE_KEY:
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_SERVICE_KEY ??
      DEFAULT_SUPABASE_SERVICE_KEY,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
    LEMONS_SQUEEZY_SIGNATURE_SECRET:
      process.env.LEMONS_SQUEEZY_SIGNATURE_SECRET,
    LEMON_SQUEEZY_API_KEY: process.env.LEMON_SQUEEZY_API_KEY,
    LEMON_SQUEEZY_STORE_ID: process.env.LEMON_SQUEEZY_STORE_ID,
    LEMON_SQUEEZY_SUBSCRIPTION_VARIANT_ID:
      process.env.LEMON_SQUEEZY_SUBSCRIPTION_VARIANT_ID,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.npm_lifecycle_event === "lint",
});
