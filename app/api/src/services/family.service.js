const repository = require('../repositories/family.repository');
const { migrateUserDataToFamily } = require('../utils/familyScope');
const { shouldRotateToken, getEndOfToday } = require('../utils/inviteTokenRotation');

async function ensureUserHasNoFamily(userId) {
  const userFamily = await repository.findUserFamily(userId);

  if (userFamily?.familyId) {
    throw new Error('Você já pertence a uma família');
  }
}

function resolveCreatorId(family, members) {
  if (family.createdById) {
    return family.createdById;
  }

  return members[0]?.id || null;
}

async function buildFamilyResponse(family, members, currentUserId) {
  const creatorId = resolveCreatorId(family, members);
  const isCreator = creatorId === currentUserId;

  let currentFamily = family;

  if (isCreator && shouldRotateToken(family.inviteTokenUpdatedAt)) {
    currentFamily = await repository.rotateInviteToken(family.id);
  }

  return {
    family: {
      id: currentFamily.id,
      name: currentFamily.name,
      createdAt: currentFamily.createdAt,
      inviteToken: isCreator ? currentFamily.inviteToken : null,
      inviteTokenValidUntil: isCreator ? getEndOfToday().toISOString() : null,
    },
    members,
    isCreator,
    creatorId,
  };
}

async function createFamily(userId, name) {
  await ensureUserHasNoFamily(userId);

  const family = await repository.createUniqueFamily({
    name: name || null,
    createdById: userId,
  });

  await repository.assignUserToFamily(userId, family.id);
  await migrateUserDataToFamily(userId, family.id);

  const members = await repository.getMembers(family.id);
  return buildFamilyResponse(family, members, userId);
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
  return buildFamilyResponse(family, members, userId);
}

async function getMyFamily(userId) {
  const userFamily = await repository.findUserFamily(userId);

  if (!userFamily?.familyId || !userFamily.family) {
    return { family: null, members: [], isCreator: false, creatorId: null };
  }

  const members = await repository.getMembers(userFamily.familyId);
  return buildFamilyResponse(userFamily.family, members, userId);
}

async function ensureCreator(userId, family) {
  const members = await repository.getMembers(family.id);
  const creatorId = resolveCreatorId(family, members);

  if (creatorId !== userId) {
    throw new Error('Somente o criador da família pode executar esta ação');
  }

  return { members, creatorId };
}

async function rotateInviteToken(userId) {
  const userFamily = await repository.findUserFamily(userId);

  if (!userFamily?.family) {
    throw new Error('Família não encontrada');
  }

  await ensureCreator(userId, userFamily.family);

  const family = await repository.rotateInviteToken(userFamily.family.id);
  const members = await repository.getMembers(family.id);

  return buildFamilyResponse(family, members, userId);
}

async function removeMember(userId, memberId) {
  const userFamily = await repository.findUserFamily(userId);

  if (!userFamily?.family) {
    throw new Error('Família não encontrada');
  }

  const { creatorId } = await ensureCreator(userId, userFamily.family);

  if (memberId === creatorId) {
    throw new Error('O criador da família não pode ser removido');
  }

  const member = await repository.findUserFamily(memberId);

  if (!member?.familyId || member.familyId !== userFamily.familyId) {
    throw new Error('Membro não encontrado nesta família');
  }

  await repository.removeUserFromFamily(memberId);

  const members = await repository.getMembers(userFamily.familyId);
  return buildFamilyResponse(userFamily.family, members, userId);
}

module.exports = {
  createFamily,
  joinFamily,
  getMyFamily,
  rotateInviteToken,
  removeMember,
};
