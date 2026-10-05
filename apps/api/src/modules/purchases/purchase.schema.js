import { z } from 'zod';

export const createPurchaseSchema = z.object({
  designId: z.string().uuid('El diseño indicado no es válido.'),
  mpPaymentId: z.string().optional(),
  mpPreferenceId: z.string().optional(),
});

export const createRatingSchema = z.object({
  designId: z.string().uuid('El diseño indicado no es válido.'),
  purchaseId: z.string().uuid('La compra indicada no es válida.'),
  score: z.number().int().min(1, 'El puntaje mínimo es 1').max(5, 'El puntaje máximo es 5'),
  comment: z
    .string()
    .max(500, 'El comentario no puede exceder 500 caracteres')
    .nullish()
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : null;
    }),
});

export function validateCreatePurchase(data) {
  const result = createPurchaseSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return { hasError: true, errorMessages: errors, data: null };
  }
  return { hasError: false, errorMessages: [], data: result.data };
}

export function validateCreateRating(data) {
  const result = createRatingSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return { hasError: true, errorMessages: errors, data: null };
  }
  return { hasError: false, errorMessages: [], data: result.data };
}
