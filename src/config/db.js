const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

const prisma = new PrismaClient({
  log: ['warn', 'error']
});

async function connect_db() {
  await prisma.$connect();
  logger.info('Database connected successfully');
}

async function disconnect_db() {
  await prisma.$disconnect();
}

module.exports = {
  prisma,
  connect_db,
  disconnect_db
};
