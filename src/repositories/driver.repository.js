const { prisma } = require('../config/db');

async function find_driver_by_id(driver_id) {
  return prisma.driver.findUnique({
    where: { driver_id }
  });
}

async function find_driver_by_vehicle_id(vehicle_id) {
  return prisma.driver.findUnique({
    where: { vehicle_id }
  });
}

async function assign_driver_to_vehicle(driver_id, vehicle_id) {
  return prisma.driver.update({
    where: { driver_id },
    data: { vehicle_id }
  });
}

module.exports = {
  find_driver_by_id,
  find_driver_by_vehicle_id,
  assign_driver_to_vehicle
};
