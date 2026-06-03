const service = require("../services/transaction.service");

async function create(req, res) {
  try {
    const userId = req.user.id;
    const { description, amount, type, categoryId, date } = req.body;

    const transaction = await service.create({
      description,
      amount,
      type,
      categoryId,
      userId,
      date
    });

    return res.json(transaction);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}

async function findAll(req, res) {
    try {
        const userId = req.user.id;

        const {
            startDate,
            endDate
        } = req.query;

        const transactions = await service.findAll(
            userId,
            startDate,
            endDate
        );

        return res.json(transactions);

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}

async function findById(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await service.findById(id, userId);

    if (!transaction) {
      return res.status(404).json({
        message: "Transação não encontrada"
      });
    }

    return res.json(transaction);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
}

async function summary(req, res) {
    try {
        const userId = req.user.id;

        const result = await service.getSummary(userId);

        return res.json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { description, amount, type, categoryId, date } = req.body;

    const transaction = await service.update(id, userId, {
      description,
      amount,
      type,
      categoryId,
      date
    });

    return res.json(transaction);

  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await service.remove(id, userId);

    return res.json({
      message: "Transação removida com sucesso",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  create,
  findAll,
  findById,
  summary,
  update,
  remove
};