const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRepository = require('../repositories/user.repository');

async function login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error('Usuário ou senha inválidos');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('Usuário ou senha inválidos');
    }
    const token = jwt.sign(
        {
            userId: user.id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d',
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
}

async function register(name, email, password) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error('E-mail já está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign(
        {
            userId: newUser.id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d',
        }
    );

    return {
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        },
    };
}

module.exports = {
    login,
    register,
};