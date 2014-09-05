var fs = require('fs');
var path = process.argv[2];

if (!path) {
    path = 'settings.json';
}

var content = fs.readFileSync(path, 'utf8');

module.exports = JSON.parse(content);
