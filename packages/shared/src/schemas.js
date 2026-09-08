import { z } from 'zod';

// User schemas
export const registerSchema = z.object({
  fullname: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(['buyer', 'seller']).default('buyer'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Design schemas
export const createDesignSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  category: z.string().min(1),
  technique: z.string().min(1),
});

// Types (inferred from schemas)
// registerSchema, loginSchema, createDesignSchema
