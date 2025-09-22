
import { z } from 'zod';

// Tool schemas
export const ToolSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  category: z.string().default('general'),
  status: z.enum(['active', 'inactive', 'maintenance']).default('active'),
  url: z.string().url().optional(),
  access_url: z.string().url().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  cookies: z.string().optional(),
  slug: z.string().optional(),
  is_active: z.boolean().default(true),
  is_maintenance: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const ToolsFilterSchema = z.object({
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
});

// User schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Email inválido'),
  name: z.string().min(1, 'Nome é obrigatório'),
  avatar: z.string().url().optional(),
});

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

// Validation helper
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join(', ');
      throw new Error(`Validação falhou: ${errorMessages}`);
    }
    throw error;
  }
};
