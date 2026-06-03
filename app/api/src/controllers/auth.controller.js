const authService = require('../services/auth.service');
const {loginAuthSchema} = require('../validations/auth.validation')

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

module.exports = {
    login,
};