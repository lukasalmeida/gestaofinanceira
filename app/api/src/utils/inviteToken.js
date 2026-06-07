const crypto = require('crypto');

const TOKEN_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomSegment(length) {
  let result = '';
  const bytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i += 1) {
    result += TOKEN_CHARS[bytes[i] % TOKEN_CHARS.length];
  }

  return result;
}

function generateInviteToken() {
  return `FAM-${randomSegment(4)}-${randomSegment(4)}`;
}

module.exports = {
  generateInviteToken,
};
