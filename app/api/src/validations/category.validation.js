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

module.exports = {
    createCategorySchema
}