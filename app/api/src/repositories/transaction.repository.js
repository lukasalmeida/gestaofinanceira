const prisma = require('../config/prisma');

async function create(date) {
    return prisma.transaction.create({
        data,
        include: {
            category: true,
        },
    });
}

async function findAllByUser(userId) {
    return prisma.transaction.findMany({
        where: {
            userId,
        },
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

async function findById(id, userId) {
    return prisma.transaction.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            category: true,
        },
    });
}

module.exports = {
    create,
    findAllByUser,
    findById,
};