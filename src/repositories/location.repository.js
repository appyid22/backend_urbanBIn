const { prisma } = require('../config/db');

async function find_location_by_id(location_id) {
  return prisma.location.findUnique({
    where: { location_id }
  });
}

module.exports = {
  find_location_by_id
};
