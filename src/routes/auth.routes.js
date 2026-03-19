const express = require('express');

const { login_controller, logout_controller } = require('../controllers/auth.controller');
const { request_validation_middleware } = require('../middlewares/request_validation.middleware');
const { auth_middleware } = require('../middlewares/auth.middleware');
const { async_handler } = require('../utils/async_handler');
const { login_schema } = require('../validations/auth.validation');

const router = express.Router();

router.post('/login', request_validation_middleware(login_schema), async_handler(login_controller));
router.post('/logout', auth_middleware, async_handler(logout_controller));

module.exports = router;
