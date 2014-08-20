var level = require('level');
var cheerio = require('cheerio');
var request = require('request');
var postsDB = level('../db/posts');
var leveldown = require('leveldown');
var path = 'https://github.com/liushuping/blog/blob/master/';
var postsPath = 'https://raw.githubusercontent.com/liushuping/blog/master/posts.json';
    
function updateAnPost(folder, post) {
    fetchAPost(path + folder + '/' + post.path, function(body) {
        var article = {};
        var $ = cheerio.load(body);

        article.id = post.id;
        article.tags = post.tags;
        article.title = $('article h1').text().trim();
        article.slug = article.title;
	article.created_on = post.created_on;
 
        $ = cheerio.load($('article').html());
        $('h1').remove();
        article.body = $.html();

        var options = { valueEncoding: 'json' };
        postsDB.put(article.id, article, options, function (err) {
            console.log('update post ', article.id, ' :', article.slug);
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
