function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getNextDueDate(bill) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDay = Number(bill.dueDay);
  let year = today.getFullYear();
  let month = today.getMonth();
  const safeDay = Math.min(dueDay, daysInMonth(year, month));

  let candidate = new Date(year, month, safeDay);
  candidate.setHours(0, 0, 0, 0);

  if (bill.recurrence === 'ONCE') {
    const createdAt = new Date(bill.createdAt);
    return new Date(createdAt.getFullYear(), createdAt.getMonth(), safeDay);
  }

  if (candidate < today) {
    if (bill.recurrence === 'MONTHLY') {
      month += 1;
      candidate = new Date(year, month, Math.min(dueDay, daysInMonth(year, month)));
    } else if (bill.recurrence === 'YEARLY') {
      candidate = new Date(year + 1, month, Math.min(dueDay, daysInMonth(year + 1, month)));
    }
  }

  candidate.setHours(0, 0, 0, 0);
  return candidate;
}

function getEndOfToday() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
}

function getDaysUntil(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dueDate);
  target.setHours(0, 0, 0, 0);

  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

function buildDueMessage(description, daysUntil) {
  if (daysUntil === 0) {
    return `A conta "${description}" vence hoje.`;
  }

  if (daysUntil === 1) {
    return `A conta "${description}" vence amanhã.`;
  }

  return `A conta "${description}" vence em ${daysUntil} dias.`;
}

module.exports = {
  getNextDueDate,
  getEndOfToday,
  getDaysUntil,
  buildDueMessage,
};
