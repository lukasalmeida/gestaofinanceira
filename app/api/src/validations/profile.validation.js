const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve conter pelo menos 3 caracteres')
    .optional(),
  email: z.string().email('E-mail inválido').optional(),
});

const updateAvatarSchema = z.object({
  avatarUrl: z
    .string()
    .min(1, 'Imagem inválida')
    .max(2_000_000, 'Imagem muito grande'),
});

const updateAccountSchema = z.object({
  currentPassword: z.string().min(6, 'Senha atual inválida'),
  password: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha inválida'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

module.exports = {
  updateProfileSchema,
  updateAvatarSchema,
  updateAccountSchema,
};
