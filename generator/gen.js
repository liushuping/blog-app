var level = require('level');
var marked = require('marked');
var request = require('request');
var postsDB = level('../db/posts');
var leveldown = require('leveldown');
var updateOption = {
   valueEncoding: 'json'
};
var path = 'https://raw.githubusercontent.com/liushuping/blog/master/';
    
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

function destroyDB(callback) {
    leveldown.destroy('../db/posts', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('../db/posts is destroyed');
            (callback instanceof Function) && callback();
        }
    });
}

function updateAnPost(folder, post) {
    fetchAPost(path + folder + '/' + post.path, function(body) {
        var pattern = /^\s*#\s+(.+)$/m;
        var matches = pattern.exec(body);
        
        post.title = matches[1];
        post.slug = post.title;
        post.body = marked(body.replace(pattern, ''));
        postsDB.put(post.id, post, updateOption, function (err) {
            console.log('update post ', post.id, ' :', post.slug);
            if (err) {
                console.log(err);
            }
        });
    });
}

function fetchAPost(url, callback) {
    request(url, function(err, res, body) {
        (callback instanceof Function) && callback(body);
    });
}

request(path + 'posts.json', function(err, res, body) {
    var postConfig = JSON.parse(body);
    for (var key in postConfig) {
        if (/\d{4}/.test(key)) {
            postConfig[key].forEach(function(post) {
                updateAnPost(key, post);
            });
        }
    }
});
