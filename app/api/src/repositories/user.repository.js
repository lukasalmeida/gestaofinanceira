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

module.exports = {
    create,
    findAll,
    findByEmail
};