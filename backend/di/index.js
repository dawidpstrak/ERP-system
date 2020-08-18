const { ContainerBuilder, JsFileLoader } = require('node-dependency-injection');
const fs = require('fs');
const path = require('path');

const container = new ContainerBuilder();
const loader = new JsFileLoader(container);

const files = fs.readdirSync(__dirname);

for (let file of files) {
    file = file.split('.')[0];

    if (file === 'index') {
        continue;
    }
    loader.load(path.join(__dirname, `./${file}.js`));
}

module.exports = container;
