const service = require('../services/transaction.service');
const { createTransactionSchema, updateTransactionSchema } = require('../validations/transaction.validation');
const { ZodError } = require('zod');

const ALLOWED_LIMITS = [10, 20, 50, 100];

function parsePagination(page, limit) {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const currentLimit = ALLOWED_LIMITS.includes(parsedLimit) ? parsedLimit : 10;

  return { currentPage, currentLimit };
}

async function create(req, res) {
  try {
    createTransactionSchema.parse(req.body);
    const userId = req.user.id;
    const { description, amount, type, categoryId, date } = req.body;

    const transaction = await service.create(userId, {
      description,
      amount,
      type,
      categoryId,
      date,
    });

    return res.json(transaction);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }

    return res.status(400).json({ message: error.message });
  }
}

async function findAll(req, res) {
  try {
    const userId = req.user.id;
    const { startDate, endDate, page, limit, type } = req.query;
    const { currentPage, currentLimit } = parsePagination(page, limit);

    const result = await service.findAll(
      userId,
      startDate || undefined,
      endDate || undefined,
      currentPage,
      currentLimit,
      type || undefined
    );

    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function findById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await service.findById(id, userId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transação não encontrada' });
    }

    return res.json(transaction);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function summary(req, res) {
  try {
    const userId = req.user.id;
    const { startDate, endDate, type } = req.query;

    const result = await service.getSummary(
      userId,
      startDate || undefined,
      endDate || undefined,
      type || undefined
    );

    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    updateTransactionSchema.parse(req.body);
    const { id } = req.params;
    const userId = req.user.id;
    const { description, amount, type, categoryId, date } = req.body;

    const transaction = await service.update(id, userId, {
      description,
      amount,
      type,
      categoryId,
      date,
    });

    return res.json(transaction);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await service.remove(id, userId);

    return res.json({ message: 'Transação removida com sucesso' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function categorySummary(req, res) {
  try {
    const userId = req.user.id;
    const result = await service.getCategorySummary(userId);

    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  create,
  findAll,
  findById,
  summary,
  update,
  remove,
  categorySummary,
};
