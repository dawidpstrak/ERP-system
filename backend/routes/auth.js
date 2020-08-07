const express = require('express');
const auth = express.Router();

const AuthController = require('../controllers/AuthController.js');

const authController = new AuthController();

auth.post('/login', (...args) => authController.login(...args));

module.exports = auth;
