const { z } = require('zod');

const createFamilySchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
});

const joinFamilySchema = z.object({
  token: z
    .string()
    .min(1, 'Token é obrigatório')
    .regex(/^FAM-[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Token inválido'),
});

module.exports = {
  createFamilySchema,
  joinFamilySchema,
};
