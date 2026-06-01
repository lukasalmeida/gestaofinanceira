const userService = require('../services/user.service');

async function createUser(req, res) {
    try {
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function findAll(req, res) {
    const users = await userService.getUsers();
    return res.json(users);
}

module.exports = {
    createUser,
    findAll,
};