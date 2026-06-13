const prisma = require('../config/prisma');
const notificationRepository = require('../repositories/notification.repository');
const { getUserScope } = require('../utils/familyScope');
const {
  getNextDueDate,
  getDaysUntil,
  buildDueMessage,
} = require('../utils/billDueDate');

async function getAccessibleBills(userId) {
  const scope = await getUserScope(userId);

  if (scope.familyId) {
    const members = await prisma.user.findMany({
      where: { familyId: scope.familyId },
      select: { id: true },
    });

    return prisma.bill.findMany({
      where: { userId: { in: members.map((member) => member.id) } },
      orderBy: { dueDay: 'asc' },
    });
  }

  return prisma.bill.findMany({
    where: { userId: scope.id },
    orderBy: { dueDay: 'asc' },
  });
}

function buildNotificationKey(billId, dueDate) {
  return `bill-${billId}-${dueDate.toISOString().split('T')[0]}`;
}

async function getBillDueNotifications(userId) {
  const bills = await getAccessibleBills(userId);
  const readKeys = await notificationRepository.getReadKeys(userId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const notifications = bills
    .map((bill) => {
      const dueDate = getNextDueDate(bill);
      const daysUntil = getDaysUntil(dueDate);
      const key = buildNotificationKey(bill.id, dueDate);

      return {
        id: key,
        key,
        type: 'BILL_DUE',
        billId: bill.id,
        description: bill.description,
        amount: Number(bill.amount),
        dueDate: dueDate.toISOString(),
        daysUntil,
        message: buildDueMessage(bill.description, daysUntil),
        read: readKeys.has(key),
      };
    })
    .filter((notification) => {
      const dueDate = new Date(notification.dueDate);
      return dueDate >= today && dueDate <= weekEnd;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const unreadCount = notifications.filter((item) => !item.read).length;

  return {
    notifications,
    unreadCount,
    total: notifications.length,
  };
}

async function markNotificationsRead(userId, keys) {
  await notificationRepository.markAsRead(userId, keys);
  return getBillDueNotifications(userId);
}

async function markAllNotificationsRead(userId) {
  const current = await getBillDueNotifications(userId);
  const keys = current.notifications.filter((item) => !item.read).map((item) => item.key);
  await notificationRepository.markAllAsRead(userId, keys);
  return getBillDueNotifications(userId);
}

module.exports = {
  getBillDueNotifications,
  markNotificationsRead,
  markAllNotificationsRead,
};
