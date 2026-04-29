import { z } from 'zod';

const envSchema = z.object({
  // Service
  API_NAME: z.string().min(1),
  API_PORT: z.coerce.number().positive(),

  // Database
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().positive(),
  DATABASE_URL: z.string().min(1),

  // JWT
  ACCESS_TOKEN_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().refine((v) => v === 1, { message: 'ACCESS_TOKEN_EXPIRES_IN_DAYS must be 1' }),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().refine((v) => v === 7, { message: 'REFRESH_TOKEN_EXPIRES_IN_DAYS must be 7' }),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw new Error(`Config validation failed:\n${result.error.toString()}`);
  }

  return result.data;
}
