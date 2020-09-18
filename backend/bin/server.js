const app = require('../');
const config = require('../config');

const port = config.app.serverPort || 5000;

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});
