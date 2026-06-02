const prisma = require('../config/prisma');

async function create(data) {
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

module.exports = {
    create,
    findAllByUser,
    findById,
    getSummary
};