/**
 * Converte "YYYY-MM-DD" para início do dia em UTC (00:00:00.000).
 */
function startOfDayUTC(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

/**
 * Converte "YYYY-MM-DD" para fim do dia em UTC (23:59:59.999).
 * Inclui todas as transações do dia informado.
 */
function endOfDayUTC(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
}

/**
 * Monta filtro Prisma para o campo `date` com base em startDate/endDate (YYYY-MM-DD).
 * Suporta apenas início, apenas fim, ou ambos.
 */
function buildDateFilter(startDate, endDate) {
  const dateFilter = {};

  if (startDate) {
    dateFilter.gte = startOfDayUTC(startDate);
  }

  if (endDate) {
    dateFilter.lte = endOfDayUTC(endDate);
  }

  return Object.keys(dateFilter).length > 0 ? dateFilter : null;
}

module.exports = {
  startOfDayUTC,
  endOfDayUTC,
  buildDateFilter,
};
