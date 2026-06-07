const repository = require('../repositories/transaction.repository');
const {
  getUserScope,
  canAccessRecord,
  buildCreatePayload,
} = require('../utils/familyScope');

async function create(userId, data) {
  const scope = await getUserScope(userId);
  const payload = buildCreatePayload(scope, userId, data);

  return repository.create(payload);
}

async function findAll(userId, startDate, endDate, page, limit, type) {
  const scope = await getUserScope(userId);

  return repository.findAllByScope(scope, startDate, endDate, page, limit, type);
}

async function findById(id, userId) {
  const scope = await getUserScope(userId);
  const transaction = await repository.findById(id);

  if (!canAccessRecord(scope, transaction)) {
    return null;
  }

  return transaction;
}

async function getSummary(userId, startDate, endDate, type) {
  const scope = await getUserScope(userId);
  const summary = await repository.getSummary(scope, startDate, endDate, type);

  return {
    ...summary,
    balance: summary.income - summary.expense,
  };
}

async function update(id, userId, data) {
  const scope = await getUserScope(userId);
  const transaction = await repository.findById(id);

  if (!canAccessRecord(scope, transaction)) {
    throw new Error('Transação não encontrada');
  }

  return repository.update(id, data);
}

async function remove(id, userId) {
  const scope = await getUserScope(userId);
  const transaction = await repository.findById(id);

  if (!canAccessRecord(scope, transaction)) {
    throw new Error('Transação não encontrada');
  }

  await repository.remove(id);

  return true;
}

async function getCategorySummary(userId) {
  const scope = await getUserScope(userId);
  return repository.getCategorySummary(scope);
}

module.exports = {
  create,
  findAll,
  findById,
  getSummary,
  update,
  remove,
  getCategorySummary,
};
