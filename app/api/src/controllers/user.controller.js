const userService = require('../services/user.service');
const { createUserSchema } = require('../validations/user.validation');
const { updateUserSchema } = require('../validations/user.validation');

const {ZodError} = require('zod');

async function createUser(req, res) {
    try {
        createUserSchema.parse(req.body);
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        return res.status(400).json({ error: error.message });
    }
}

async function findAll(req, res) {
    const users = await userService.getUsers();
    return res.json(users);
}

async function findById(req, res) {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado!' });
    }
    return res.json(user);
}

async function updateUser(req, res) {
    try {
        updateUserSchema.parse(req.body);
        const user = await userService.updateUser(req.params.id, req.body);
        return res.json(user);
    }
    catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createUser,
    findAll,
    findById,
    updateUser
};