const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const di = require('./di');
app.set('di', di);

app.use(bodyParser.json());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

const router = require('./routes')(di);

app.use(router);

module.exports = app;
