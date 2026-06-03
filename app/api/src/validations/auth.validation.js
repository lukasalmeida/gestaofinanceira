const {z} = require('zod');

const loginAuthSchema = z.object({
    email: z  
        .string()
        .email('E-mail inválido - exemplo@dominio.com'),
    password: z
        .string()
        .min(6)
})

module.exports = {
    loginAuthSchema
}