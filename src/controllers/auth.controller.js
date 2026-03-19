const { login_service, logout_service } = require('../services/auth.service');

async function login_controller(req, res) {
  const result = await login_service(req.body);

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result
  });
}

async function logout_controller(req, res) {
  const result = logout_service();

  return res.status(200).json({
    success: true,
    message: result.message
  });
}

module.exports = {
  login_controller,
  logout_controller
};
