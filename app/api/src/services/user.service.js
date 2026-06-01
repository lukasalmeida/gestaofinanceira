const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');

async function createUser(data) {
    const userExists = await userRepository.findByEmail(data.email);
    if (userExists) {
        throw new Error('E-mail já cadastrado!');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return userRepository.create({
        name: data.name,
        email: data.email,
        password: passwordHash,
    });
}

async function getUsers() {
    return userRepository.findAll();
}

module.exports = {
    createUser,
    getUsers,
};