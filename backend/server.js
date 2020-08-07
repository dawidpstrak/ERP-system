const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const auth = require('./routes/auth');
const employees = require('./routes/employee');

app.use('/auth', auth);
app.use('/employees', employees);

const port = config.app.serverPort || 5000;

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});
