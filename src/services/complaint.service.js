const { create_complaint } = require('../repositories/complaint.repository');
const { find_bin_by_id } = require('../repositories/bin.repository');
const { AppError } = require('../utils/app_error');

async function create_complaint_service(payload, file) {
  const bin_id = Number(payload.bin_id);
  const bin = await find_bin_by_id(bin_id);

  if (!bin) {
    throw new AppError('bin_id does not exist', 400);
  }

  if (!file) {
    throw new AppError('Complaint image is required', 400);
  }

  return create_complaint({
    bin_id,
    reported_by: payload.reported_by || 'anonymous',
    description: payload.description,
    image_path: file.path,
    status: 'OPEN'
  });
}

module.exports = {
  create_complaint_service
};
