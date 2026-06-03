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

async function update(id, data) {
    return prisma.category.update({
        where: {
            id,
        },
        data,
    });
}

async function remove(id) {
    return prisma.category.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    create,
    findAllByUser,
    findById,
    update,
    remove
};