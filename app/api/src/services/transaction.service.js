const repository = require("../repositories/transaction.repository");

async function create(data) {
  return repository.create(data);
}

async function findAll(
    userId,
    startDate,
    endDate
) {
    return repository.findAllByUser(
        userId,
        startDate,
        endDate
    );
}

async function findById(id, userId) {
  return repository.findById(id, userId);
}

async function getSummary(userId) {
    const summary = await repository.getSummary(userId);

    return {
        ...summary,
        balance: summary.income - summary.expense,
    };
}

async function update(id, userId, data) {
    const transaction = await repository.findById(id, userId);

    if (!transaction) {
        throw new Error("Transação não encontrada");
    }
    return repository.update(id, data);
}

async function remove(id, userId) {
    const transaction = await repository.findById(id, userId);

    if (!transaction) {
        throw new Error("Transação não encontrada");
    }
    await repository.remove(id);

    return true;
}

async function getCategorySummary(userId) {
    return repository.getCategorySummary(userId);
}

module.exports = {
  create,
  findAll,
  findById,
  getSummary,
  update,
  remove,
  getCategorySummary
};