const { prisma } = require('../config/db');

async function find_user_by_email(email) {
  return prisma.user.findUnique({
    where: { email }
  });
}

module.exports = {
  find_user_by_email
};
