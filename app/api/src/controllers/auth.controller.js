const authService = require('../services/auth.service');
const {loginAuthSchema, registerAuthSchema} = require('../validations/auth.validation')

async function login(req, res) {
    try {
        loginAuthSchema.parse(req.body)
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.json(result);

    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

async function register(req, res) {
    try {
        registerAuthSchema.parse(req.body)
        const { name, email, password } = req.body;

        const result = await authService.register(name, email, password);

        res.status(201).json(result);

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    login,
    register,
};