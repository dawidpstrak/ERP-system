const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const auth = require('./routes/auth');
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});
