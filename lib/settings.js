var fs = require('fs');
//var path = require('path');
//var settings_path = path.join(__dirname, 'settings.json');
var content = fs.readFileSync('settings.json', 'utf8');

module.exports = JSON.parse(content);
