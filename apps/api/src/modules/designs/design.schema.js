import { z } from 'zod';

const CATEGORIES = ['sublimado', 'estampado', 'papeleria', 'infantil', 'deportivo', 'religioso', 'otro'];
const TECHNIQUES = ['sublimado', 'estampado', 'vinilo', 'dtf', 'otro'];

export const createDesignSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  price: z
    .number()
    .positive('El precio debe ser positivo')
    .max(999999.99, 'El precio no puede exceder 999999.99'),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: `Categoría inválida. Opciones: ${CATEGORIES.join(', ')}` }),
  }),
  categorySuggested: z.string().max(100).optional(),
  technique: z.enum(TECHNIQUES, {
    errorMap: () => ({ message: `Técnica inválida. Opciones: ${TECHNIQUES.join(', ')}` }),
  }),
});

export const updateDesignSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(2000).optional(),
  price: z.number().positive().max(999999.99).optional(),
  category: z.enum(CATEGORIES).optional(),
  categorySuggested: z.string().max(100).optional(),
  technique: z.enum(TECHNIQUES).optional(),
});

export const queryDesignSchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  technique: z.enum(TECHNIQUES).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  priceMin: z.coerce.number().positive().optional(),
  priceMax: z.coerce.number().positive().optional(),
  search: z.string().max(200).optional(),
  sort: z.enum(['recent', 'popular', 'trending', 'rating', 'price_asc', 'price_desc']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  sellerId: z.string().uuid().optional(),
});

export function validateCreateDesign(data) {
  const result = createDesignSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return { hasError: true, errorMessages: errors, data: null };
  }
  return { hasError: false, errorMessages: [], data: result.data };
}

export function validateUpdateDesign(data) {
  const result = updateDesignSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return { hasError: true, errorMessages: errors, data: null };
  }
  return { hasError: false, errorMessages: [], data: result.data };
}

export function validateQueryDesign(data) {
  const result = queryDesignSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    return { hasError: true, errorMessages: errors, data: null };
  }
  return { hasError: false, errorMessages: [], data: result.data };
}
