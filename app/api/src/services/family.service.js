const repository = require('../repositories/family.repository');
const { migrateUserDataToFamily } = require('../utils/familyScope');

async function ensureUserHasNoFamily(userId) {
  const userFamily = await repository.findUserFamily(userId);

  if (userFamily?.familyId) {
    throw new Error('Você já pertence a uma família');
  }
}

async function createFamily(userId, name) {
  await ensureUserHasNoFamily(userId);

  const family = await repository.createUniqueFamily({ name: name || null });
  await repository.assignUserToFamily(userId, family.id);
  await migrateUserDataToFamily(userId, family.id);

  const members = await repository.getMembers(family.id);

  return { family, members };
}

async function joinFamily(userId, token) {
  await ensureUserHasNoFamily(userId);

  const normalizedToken = token.trim().toUpperCase();
  const family = await repository.findByToken(normalizedToken);

  if (!family) {
    throw new Error('Família não encontrada para o token informado');
  }

  await repository.assignUserToFamily(userId, family.id);
  await migrateUserDataToFamily(userId, family.id);

  const members = await repository.getMembers(family.id);

  return { family, members };
}

async function getMyFamily(userId) {
  const userFamily = await repository.findUserFamily(userId);

  if (!userFamily?.familyId || !userFamily.family) {
    return { family: null, members: [] };
  }

  const members = await repository.getMembers(userFamily.familyId);

  return {
    family: userFamily.family,
    members,
  };
}

module.exports = {
  createFamily,
  joinFamily,
  getMyFamily,
};
