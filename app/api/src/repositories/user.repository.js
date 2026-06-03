const prisma = require('../config/prisma');

async function create(data) {
    return prisma.user.create({
        data,
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true
        }
    });
}

async function findAll() {
    return prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
}

async function findByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email
        }
    });
}

async function findById(id) {
    return prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true
        }
    });
}

async function updateUser(id, data) {
    return prisma.user.update({
        where: {
            id
        },
        data,
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true
        }
    });
}   

module.exports = {
    create,
    findAll,
    findByEmail,
    findById,
    updateUser
};