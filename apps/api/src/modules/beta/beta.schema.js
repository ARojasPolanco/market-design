import { z } from 'zod';

export const createBetaSignupSchema = z.object({
  fullname: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(120, 'El nombre no puede exceder 120 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z
    .string()
    .max(30, 'El WhatsApp no puede exceder 30 caracteres')
    .nullish()
    .transform((value) => value?.trim() || null),
  slotKey: z.string().min(1, 'Elegí una fecha para la reunión'),
  utmSource: z
    .string()
    .max(120)
    .nullish()
    .transform((value) => value?.trim() || null),
  utmMedium: z
    .string()
    .max(120)
    .nullish()
    .transform((value) => value?.trim() || null),
  utmCampaign: z
    .string()
    .max(120)
    .nullish()
    .transform((value) => value?.trim() || null),
});

export function validateCreateBetaSignup(data) {
  const result = createBetaSignupSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return { hasError: true, errorMessages: errors, data: null };
  }
  return { hasError: false, errorMessages: [], data: result.data };
}
