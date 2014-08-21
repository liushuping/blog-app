var level = require('level');
var cheerio = require('cheerio');
var request = require('request');
var postsDB = level('../db/posts');
var path = 'https://github.com/liushuping/blog/blob/master/';
var postsPath = 'https://raw.githubusercontent.com/liushuping/blog/master/posts.json';
    
function updateAnPost(folder, post) {
    fetchAPost(path + folder + '/' + post.path, function(body) {
        var $ = cheerio.load(body);

        post.title = $('article h1').text().trim();
        post.slug = post.title;
 
        $ = cheerio.load($('article').html());
        $('h1').remove();
        post.body = $.html();

        var options = { valueEncoding: 'json' };
        postsDB.put(post.id, post, options, function (err) {
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

request(postsPath, function(err, res, body) {
    var postConfig = JSON.parse(body);
    for (var key in postConfig) {
        if (/\d{4}/.test(key)) {
            postConfig[key].forEach(function(post) {
                updateAnPost(key, post);
            });
        }
    }
});
