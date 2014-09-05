var fs = require('fs');
var request = require('request');
var url = process.argv[2];

if (url) {
    request(url, function(err, res, body) {
        module.exports = JSON.parse(body);
    });
} else {
    var content = fs.readFileSync('settings.json', 'utf8');
    module.exports = JSON.parse(content);
}
