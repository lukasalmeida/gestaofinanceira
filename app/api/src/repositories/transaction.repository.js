const prisma = require('../config/prisma');
const { buildDateFilter } = require('../utils/dateRange');

const ALLOWED_LIMITS = [10, 20, 50, 100];

function normalizePagination(page, limit) {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const currentLimit = ALLOWED_LIMITS.includes(parsedLimit) ? parsedLimit : 10;

  return { currentPage, currentLimit };
}

async function create(data) {
  return prisma.transaction.create({
    data,
    include: {
      category: true,
    },
  });
}

async function findAllByUser(userId, startDate, endDate, page = 1, limit = 10, type) {
  const where = { userId };

  const dateFilter = buildDateFilter(startDate, endDate);
  if (dateFilter) {
    where.date = dateFilter;
  }

  if (type && type !== 'ALL') {
    where.type = type;
  }

  const { currentPage, currentLimit } = normalizePagination(page, limit);
  const skip = (currentPage - 1) * currentLimit;

  const total = await prisma.transaction.count({ where });

  const transactions = await prisma.transaction.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
    skip,
    take: currentLimit,
  });

  const pages = total === 0 ? 0 : Math.ceil(total / currentLimit);

  return {
    transactions,
    total,
    page: currentPage,
    limit: currentLimit,
    pages,
  };
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

async function countByCategory(categoryId) {
  return prisma.transaction.count({
    where: {
      categoryId,
    },
  });
}

async function getSummary(userId, startDate, endDate, type) {
  const where = { userId };

  const dateFilter = buildDateFilter(startDate, endDate);
  if (dateFilter) {
    where.date = dateFilter;
  }

  if (type && type !== 'ALL') {
    where.type = type;
  }

  const incomes = await prisma.transaction.aggregate({
    where: { ...where, type: 'INCOME' },
    _sum: { amount: true },
  });

  const expenses = await prisma.transaction.aggregate({
    where: { ...where, type: 'EXPENSE' },
    _sum: { amount: true },
  });

  return {
    income: incomes._sum.amount || 0,
    expense: expenses._sum.amount || 0,
  };
}

async function update(id, data) {
  return prisma.transaction.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
}

async function remove(id) {
  return prisma.transaction.delete({
    where: { id },
  });
}

async function getCategorySummary(userId) {
  const transactions = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { userId },
    _sum: { amount: true },
  });

  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: transactions.map((item) => item.categoryId),
      },
    },
  });

  return transactions.map((transaction) => {
    const category = categories.find((c) => c.id === transaction.categoryId);

    return {
      category: category?.name,
      type: category?.type,
      total: transaction._sum.amount || 0,
    };
  });
}

module.exports = {
  create,
  findAllByUser,
  findById,
  getSummary,
  update,
  remove,
  getCategorySummary,
};
