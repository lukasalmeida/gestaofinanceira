const service = require('../services/notification.service');

async function getBillDue(req, res) {
  try {
    const userId = req.user.id;
    const result = await service.getBillDueNotifications(userId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function markRead(req, res) {
  try {
    const userId = req.user.id;
    const { keys } = req.body;

    if (!Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({ message: 'Informe as notificações para marcar como lidas' });
    }

    const result = await service.markNotificationsRead(userId, keys);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function markAllRead(req, res) {
  try {
    const userId = req.user.id;
    const result = await service.markAllNotificationsRead(userId);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getBillDue,
  markRead,
  markAllRead,
};
