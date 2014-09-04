var express = require('express');
var router = express.Router();
var postsLib = require('../lib/posts');
var settings = require('../lib/settings');
var Rss = require('rss');
var title = settings.site_title;
var description = settings.site_description;
var xml;

var feed = new Rss({
    title: title,
    description: description,
    feed_url: settings.site_home + 'rss.xml',
    site_url: settings.site_home,
    author: settings.site_owner,
    copyright: (new Date).getFullYear() + ' Shuping LIU'
});


postsLib.getAll(function(posts)  {
    posts.forEach(function(post) {
        feed.item({
            title: post.title,
            description: post.body,
            url: settings.site_home + post.id + '/' + post.slug,
            date: post.created_on
        });
    });

    xml = feed.xml();
});


router.get('/rss.xml', function(req, res) {
    res.header('Content-Type', 'application/xml');
    res.send(xml);
});

module.exports = router;
