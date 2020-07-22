const express = require('express');
const users = express.Router();

const AuthController = require('../controllers/AuthController.js');
const authController = new AuthController();

users.post('/register', (...args) => authController.create(...args));
users.post('/login', (...args) => authController.login(...args));

module.exports = users;
