const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { env } = require('../config/env');
const { find_user_by_email } = require('../repositories/auth.repository');
const { AppError } = require('../utils/app_error');

async function login_service(payload) {
  const { email, password } = payload;

  const user = await find_user_by_email(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const is_password_valid = await bcrypt.compare(password, user.password_hash);
  if (!is_password_valid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role
    },
    env.jwt_secret,
    { expiresIn: env.jwt_expires_in }
  );

  return {
    token,
    user: {
      user_id: user.user_id,
      email: user.email,
      role: user.role
    }
  };
}

function logout_service() {
  return {
    message: 'Logout successful. Please delete token on client side.'
  };
}

module.exports = {
  login_service,
  logout_service
};
