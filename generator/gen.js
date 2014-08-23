var level = require('level');
var cheerio = require('cheerio');
var request = require('request');
var postsDB = level('../db/posts');
var path = 'https://github.com/liushuping/blog/blob/master/';
var postsPath = 'https://raw.githubusercontent.com/liushuping/blog/master/posts.json';
    
function updateAnPost(folder, post) {
    fetchAPost(path + folder + '/' + post.path, function(body) {
        var $ = cheerio.load(body);
        var extracted = extract(body);
 
        post.title = extracted.title;
        post.slug = post.title;
        post.body = extracted.article;

        var options = { valueEncoding: 'json' };
        postsDB.put(post.id, post, options, function (err) {
            console.log('update post ', post.id, ' :', post.slug);
            if (err) {
                console.log(err);
            }
        });
    });
}

function extract(body) {
    var replacement = String.fromCharCode(160);
    replacement += String.fromCharCode(161);
    replacement += String.fromCharCode(162);
    replacement += String.fromCharCode(163);

    var pattern = new RegExp(replacement, 'g');

    body = removeSpaces(body);
    body = body.replace(/\n/g, replacement);
    var article = body.match(/<article.*>.+<\/article>/)[0];
    var title = article.match(/<h1.*>(.+)<\/h1>/)[1];
    title = title.replace(pattern, '');
    
    article = article.replace(/<h1.*>.+<\/h1>/, '');
    article = article.replace(pattern, '\n');

    return {
        title: title,
        article: article
    };
}

function removeSpaces(body) {
    body = body.replace(/<\s*\/\s*(.+)\s*>[\r\n\s]+<?\s*(.+)\s*>/g, '</$1><$2>');
    return body.replace(/<\s*(.+)\s*\/\s*>[\r\n\s]+<?\s*(.+)\s*>/g, '<$1/><$2>');
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
