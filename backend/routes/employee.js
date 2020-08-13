const express = require('express');
const employees = express.Router();

const userValidator = require('../validators/user');

const validate = require('../middleware/validate');

const EmployeeController = require('../controllers/EmployeeController.js');
const employeeController = new EmployeeController();

employees.get('/', (...args) => employeeController.index(...args));
employees.post('/', [userValidator.store, validate], (...args) => employeeController.store(...args));
employees.put('/:id', [userValidator.update, validate], (...args) => employeeController.update(...args));
employees.delete('/:id', (...args) => employeeController.delete(...args));

module.exports = employees;
