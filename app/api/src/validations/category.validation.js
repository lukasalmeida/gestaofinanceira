const {z} = require('zod');

const createCategorySchema = z.object({
    // name
    name: z
        .string()
        .min(4),
    // type
    type: z
        .enum(
            [
                'INCOME',
                'EXPENSE'
            ]
        )
});

const updateCategorySchema = z.object({
    name: z
        .string()
        .min(4)
        .optional(),

    type: z
        .enum(
            [
                'INCOME',
                'EXPENSE'
            ]
        )
        .optional()
})

module.exports = {
    createCategorySchema,
    updateCategorySchema
}