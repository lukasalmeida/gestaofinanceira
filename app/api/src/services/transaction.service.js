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

module.exports = {
  create,
  findAll,
  findById,
  getSummary
};