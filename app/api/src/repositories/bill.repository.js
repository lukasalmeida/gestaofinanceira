const prisma = require('../config/prisma');

async function create(data) {
    return prisma.bill.create({
        data
    });
}


async function findById(id, userId) {
    return prisma.bill.findFirst({
        where: {
            id,
            userId
        }
    });
}

async function update(id, data) {
    return prisma.bill.update({
        where: {
            id
        },
        data
    });
}

async function remove(id) {
    return prisma.bill.delete({
        where: {
            id
        }
    });
}

async function findAll(
    userId,
    dueDay,
    minAmount,
    maxAmount
) {
    const where = {
        userId
    };

    if (dueDay) {
        where.dueDay = Number(dueDay);
    }

    if (minAmount || maxAmount) {
        where.amount = {};
    }

    if (minAmount) {
        where.amount.gte = Number(minAmount);
    }

    if (maxAmount) {
        where.amount.lte = Number(maxAmount);
    }

    return prisma.bill.findMany({
        where,
        orderBy: {
            dueDay: 'asc'
        }
    });
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
}