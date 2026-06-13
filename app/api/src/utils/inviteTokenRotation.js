function getStartOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function getEndOfToday() {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

function shouldRotateToken(inviteTokenUpdatedAt) {
  if (!inviteTokenUpdatedAt) {
    return true;
  }

  return new Date(inviteTokenUpdatedAt) < getStartOfToday();
}

module.exports = {
  getStartOfToday,
  getEndOfToday,
  shouldRotateToken,
};
