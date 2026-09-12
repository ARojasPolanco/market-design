import { z } from 'zod';

export const createPurchaseSchema = z.object({
  designId: z.string().uuid('ID de diseño inválido'),
});

export const createRatingSchema = z.object({
  designId: z.string().uuid('ID de diseño inválido'),
  purchaseId: z.string().uuid('ID de compra inválido'),
  score: z.number().int().min(1, 'El puntaje mínimo es 1').max(5, 'El puntaje máximo es 5'),
  comment: z.string().max(500, 'El comentario no puede exceder 500 caracteres').optional(),
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
