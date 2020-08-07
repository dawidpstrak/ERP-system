const express = require('express');
const employees = express.Router();

const EmployeeController = require('../controllers/EmployeeController.js');

const employeeController = new EmployeeController();

employees.post('/', (...args) => employeeController.store(...args));

module.exports = employees;
