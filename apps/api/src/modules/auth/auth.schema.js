import { z } from 'zod';

export const registerSchema = z.object({
  fullname: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128, 'La contraseña no puede exceder 128 caracteres'),
  storeName: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const updateProfileSchema = z.object({
  fullname: z.string().min(2).max(100).optional(),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/).optional(),
  storeName: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .max(128),
});

export function validateRegister(data) {
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return { hasError: true, errorMessages: errors, data: null };
  }
  return { hasError: false, errorMessages: [], data: result.data };
}

export function validateLogin(data) {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return { hasError: true, errorMessages: errors, data: null };
  }
  return { hasError: false, errorMessages: [], data: result.data };
}

export function validateUpdateProfile(data) {
  const result = updateProfileSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return { hasError: true, errorMessages: errors, data: null };
  }
  return { hasError: false, errorMessages: [], data: result.data };
}

export function validateChangePassword(data) {
  const result = changePasswordSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return { hasError: true, errorMessages: errors, data: null };
  }
  return { hasError: false, errorMessages: [], data: result.data };
}
