const express = require('express');
const employees = express.Router();

const EmployeeController = require('../controllers/EmployeeController.js');

const employeeController = new EmployeeController();

employees.get('/', (...args) => employeeController.index(...args));
employees.post('/', (...args) => employeeController.store(...args));

module.exports = employees;
