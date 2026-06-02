const prisma = require('../config/prisma');

async function create(data) {
    return prisma.category.create({
        data,
    });
}

async function findAllByUser(userId) {
    return prisma.category.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

async function findById(id, userId) {
    return prisma.category.findUnique({
        where: {
            id,
        },
    });
}

module.exports = {
    create,
    findAllByUser,
    findById,
};