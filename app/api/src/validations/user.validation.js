const { z } = require('zod');

const createUserSchema = z.object({
    // name
    name: z
        .string()
        .min(3, 'O nome deve conter pelo menos 3 caracteres')
        .refine(
            (texto) => texto.trim().split(/\s+/).length >= 2,
            {
                message: 'O nome deve conter pelo menos 2 palavras'
            }
        ),
    // email
    email: z
        .string()
        .email('O email é inválido'),
    // password
    password: z
        .string()
        .min(6, 'A senha deve conter pelo menos 6 caracteres')
});

const updateUserSchema = z.object({
    name: z
        .string()
        .min(3, 'O nome deve conter pelo menos 3 caracteres')
        .refine(
            (texto) => texto.trim().split(/\s+/).length >= 2,
            {
                message: 'O nome deve conter pelo menos 2 palavras'
            }
        )
        .optional(),
    email: z
        .string()
        .email('O email é inválido')
        .optional(),
    password: z
        .string()
        .min(6, 'A senha deve conter pelo menos 6 caracteres')
        .optional()
});

module.exports = {
    createUserSchema,
    updateUserSchema
};