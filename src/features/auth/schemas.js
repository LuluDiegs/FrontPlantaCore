import { z } from 'zod';

const passwordRules = z
  .string()
  .min(8, 'Mínimo de 8 caracteres')
  .regex(/[a-z]/, 'Precisa ter uma letra minúscula')
  .regex(/[A-Z]/, 'Precisa ter uma letra maiúscula')
  .regex(/[0-9]/, 'Precisa ter um número')
  .regex(/[^a-zA-Z0-9]/, 'Precisa ter um caractere especial');

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Informe sua senha'),
});

export const registerSchema = z
  .object({
    nome: z.string().min(2, 'Mínimo de 2 caracteres').max(255, 'Máximo de 255 caracteres'),
    email: z.string().email('Email inválido'),
    senha: passwordRules,
    confirmacaoSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmacaoSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmacaoSenha'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z
  .object({
    novaSenha: passwordRules,
    confirmacaoSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmacaoSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmacaoSenha'],
  });
