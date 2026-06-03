const prisma = require('../config/prisma');

async function create(data) {
    return prisma.transaction.create({
        data,
        include: {
            category: true,
        },
    });
}

async function findAllByUser(
    userId,
    startDate,
    endDate
) {

    const where = {
        userId,
    };

    if (startDate && endDate) {
        where.date = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }

    return prisma.transaction.findMany({
        where,
        include: {
            category: true,
        },
        orderBy: {
            date: 'desc',
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

async function getSummary(userId) {
  const incomes = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "INCOME",
    },
    _sum: {
      amount: true,
    },
  });

  const expenses = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "EXPENSE",
    },
    _sum: {
      amount: true,
    },
  });

  return {
    income: incomes._sum.amount || 0,
    expense: expenses._sum.amount || 0,
    }
}

async function update(id, data) {
    return prisma.transaction.update({
        where: {
            id,
        },
        data,
        include: {
            category: true,
        },
    });
}

async function remove(id) {
    return prisma.transaction.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    create,
    findAllByUser,
    findById,
    getSummary,
    update,
    remove
};