var fs = require('fs');
var content = fs.readFileSync('settings.json', 'utf8');

module.exports = JSON.parse(content);
