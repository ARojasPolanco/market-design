import { z } from 'zod';

export const createConversationSchema = z.object({
  type: z.enum(['buyer_seller', 'support']).optional().default('buyer_seller'),
  sellerId: z.string().uuid('El vendedor indicado no es válido.').optional(),
  designId: z.string().uuid('El diseño indicado no es válido.').optional(),
});

export const sendMessageSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, 'El mensaje no puede estar vacío')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres'),
});

export const reportMessageSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, 'Contanos brevemente el motivo (mínimo 5 caracteres)')
    .max(500, 'El motivo no puede exceder 500 caracteres'),
});

export function validateCreateConversation(data) {
  const result = createConversationSchema.safeParse(data);
  if (!result.success) {
    return { hasError: true, errorMessages: result.error.errors.map((e) => e.message) };
  }
  return { hasError: false, data: result.data };
}

export function validateSendMessage(data) {
  const result = sendMessageSchema.safeParse(data);
  if (!result.success) {
    return { hasError: true, errorMessages: result.error.errors.map((e) => e.message) };
  }
  return { hasError: false, data: result.data };
}

export function validateReportMessage(data) {
  const result = reportMessageSchema.safeParse(data);
  if (!result.success) {
    return { hasError: true, errorMessages: result.error.errors.map((e) => e.message) };
  }
  return { hasError: false, data: result.data };
}
