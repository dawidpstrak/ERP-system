const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const config = require('./config');
const app = express();

const di = require('./di');
app.set('di', di);

app.use(bodyParser.json());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

const router = require('./routes')(di);

app.use(router);

const port = config.app.serverPort || 5000;

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});
