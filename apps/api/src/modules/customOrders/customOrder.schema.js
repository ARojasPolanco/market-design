import { z } from 'zod';

export const createCustomOrderSchema = z.object({
  sellerId: z.string().uuid('El vendedor indicado no es válido.'),
  baseDesignId: z.string().uuid('El diseño indicado no es válido.').optional(),
  conversationId: z.string().uuid('La conversación indicada no es válida.').optional(),
  title: z.string().trim().max(200).optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
});

export const quoteCustomOrderSchema = z.object({
  price: z.coerce
    .number()
    .positive('El precio debe ser mayor a 0')
    .max(10000000, 'El precio es demasiado alto'),
  description: z
    .string()
    .trim()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),
});

export function validateCreateCustomOrder(data) {
  const result = createCustomOrderSchema.safeParse(data);
  if (!result.success) {
    return { hasError: true, errorMessages: result.error.errors.map((e) => e.message) };
  }
  return { hasError: false, data: result.data };
}

export function validateQuoteCustomOrder(data) {
  const result = quoteCustomOrderSchema.safeParse(data);
  if (!result.success) {
    return { hasError: true, errorMessages: result.error.errors.map((e) => e.message) };
  }
  return { hasError: false, data: result.data };
}
