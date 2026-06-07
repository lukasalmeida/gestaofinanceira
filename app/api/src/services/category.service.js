const repository = require('../repositories/category.repository');
const transactionRepository = require('../repositories/transaction.repository');
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

async function findAll(userId) {
  const scope = await getUserScope(userId);
  return repository.findAllByScope(scope);
}

async function findById(id, userId) {
  const scope = await getUserScope(userId);
  const category = await repository.findById(id);

  if (!canAccessRecord(scope, category)) {
    return null;
  }

  return category;
}

async function update(id, userId, data) {
  const scope = await getUserScope(userId);
  const category = await repository.findById(id);

  if (!canAccessRecord(scope, category)) {
    throw new Error('Categoria não encontrada');
  }

  return repository.update(id, data);
}

async function remove(id, userId) {
  const scope = await getUserScope(userId);
  const category = await repository.findById(id);

  if (!canAccessRecord(scope, category)) {
    throw new Error('Categoria não encontrada');
  }

  const transactionCount = await transactionRepository.countByCategory(id);

  if (transactionCount > 0) {
    throw new Error(`Esta categoria possui ${transactionCount} transação(ões) relacionada(s) e não pode ser removida`);
  }

  await repository.remove(id);

  return true;
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
};
