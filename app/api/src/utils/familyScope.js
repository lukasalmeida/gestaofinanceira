const prisma = require('../config/prisma');

async function getUserScope(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, familyId: true },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  return user;
}

function buildOwnershipWhere(scope) {
  if (scope.familyId) {
    return { familyId: scope.familyId };
  }

  return {
    userId: scope.id,
    familyId: null,
  };
}

function canAccessRecord(scope, record) {
  if (!record) {
    return false;
  }

  if (scope.familyId) {
    return record.familyId === scope.familyId;
  }

  return record.userId === scope.id && record.familyId === null;
}

async function migrateUserDataToFamily(userId, familyId) {
  await prisma.category.updateMany({
    where: { userId, familyId: null },
    data: { familyId },
  });

  await prisma.transaction.updateMany({
    where: { userId, familyId: null },
    data: { familyId },
  });

  await prisma.account.updateMany({
    where: { userId, familyId: null },
    data: { familyId },
  });
}

function buildCreatePayload(scope, userId, data) {
  return {
    ...data,
    userId,
    familyId: scope.familyId || null,
  };
}

module.exports = {
  getUserScope,
  buildOwnershipWhere,
  canAccessRecord,
  migrateUserDataToFamily,
  buildCreatePayload,
};
