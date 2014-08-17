var path = require('path');
var level = require('level');
var postsDB = level(path.join(__dirname, '../db/posts'));

var postGetOptions = {
    valueEncoding: 'json'
};

function getAll(callback) {
    var posts = [];
    var stream = postsDB.createValueStream(postGetOptions);

    stream.on('data', function(post) {
        posts.push(post);
    });

    stream.on('end', function() {
	callback && callback(posts);
    });
}

function get(id, callback) {
    postsDB.get(id, postGetOptions, function(err, post) {
        callback(err || post);
    });
}

exports.get = get;
exports.getAll = getAll;
