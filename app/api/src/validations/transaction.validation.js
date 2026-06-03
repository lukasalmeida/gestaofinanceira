const {z} = require('zod');

const createTransactionSchema = z.object({
    description: z
        .string()
        .min(3, 'A descrição deve conter pelo menos 3 caracteres'),
    amount: z
        .number()
        .positive('O valor deve ser maior que zero'),
    
    type: z.enum(
        ['INCOME', 'EXPENSE'],
        {
            errorMap: () => ({
                message: 'O tipo inválido!'
            })
        }
    ),

    categoryId: z
        .uuid('O ID da categoria é inválido'),
    
    date: z
        .string()
        .datetime(),

});

const updateTransactionSchema = z.object({
    description: z
        .string()
        .min(3, 'A descrição deve conter pelo menos 3 caracteres')
        .optional(),
    amount: z
        .number()
        .positive('O valor deve ser maior que zero')
        .optional(),
    type: z.enum(
        ['INCOME', 'EXPENSE'],
        {
            errorMap: () => ({
                message: 'O tipo inválido!'
            })
        }
    ).optional(),
    categoryId: z
        .uuid('O ID da categoria é inválido')
        .optional(),
    date: z
        .string()
        .datetime()
        .optional()
});

module.exports = {
    createTransactionSchema,
    updateTransactionSchema
};