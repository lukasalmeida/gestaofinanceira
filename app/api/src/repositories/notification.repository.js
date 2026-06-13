const prisma = require('../config/prisma');

async function getReadKeys(userId) {
  const reads = await prisma.notificationRead.findMany({
    where: { userId },
    select: { notificationKey: true },
  });

  return new Set(reads.map((item) => item.notificationKey));
}

async function markAsRead(userId, keys) {
  if (!keys.length) {
    return [];
  }

  await prisma.notificationRead.createMany({
    data: keys.map((notificationKey) => ({ userId, notificationKey })),
    skipDuplicates: true,
  });

  return keys;
}

async function markAllAsRead(userId, keys) {
  return markAsRead(userId, keys);
}

module.exports = {
  getReadKeys,
  markAsRead,
  markAllAsRead,
};
