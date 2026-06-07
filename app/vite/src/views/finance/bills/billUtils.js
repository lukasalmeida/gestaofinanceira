import { RECURRENCE_LABELS } from './constants';

export function parseBillAmount(value) {
  return Number(value);
}

export function getRecurrenceLabel(recurrence) {
  return RECURRENCE_LABELS[recurrence] || recurrence;
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getNextDueDate(bill) {
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

  return candidate;
}

export function buildBillSummary(bills) {
  if (!bills.length) {
    return {
      count: 0,
      total: 0,
      nextDue: null
    };
  }

  const total = bills.reduce((acc, bill) => acc + parseBillAmount(bill.amount), 0);
  const nextDue = bills
    .map((bill) => getNextDueDate(bill))
    .sort((a, b) => a - b)[0];

  return {
    count: bills.length,
    total,
    nextDue
  };
}
