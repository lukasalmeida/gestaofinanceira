const { z } = require('zod');

const createBillSchema = z.object({
    description: z.string().min(3),

    amount: z.number().positive(),

    recurrence: z.enum([
        'MONTHLY',
        'YEARLY',
        'ONCE'
    ]),

    dueDay: z.number().min(1).max(31)
});

module.exports = {
    createBillSchema
}