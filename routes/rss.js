var express = require('express');
var router = express.Router();
var postsLib = require('../lib/posts');
var Rss = require('rss');
var title = '高阶是对抽象的抽象';
var description = '刘淑平的Blog，专注于前端程序开发，致力于提高代码质量。对JavaScript和C#以及函数式编程有浓厚兴趣，认为抽象是解决复杂软件问题的强有力工具。';
var xml;

var feed = new Rss({
    title: title,
    description: description,
    feed_url: 'http://blog.liushuping.com/rss.xml',
    site_url: 'http://blog.liushuping.com',
    author: 'Shuping LIU',
    copyright: '2014 Shuping LIU'
});


postsLib.getAll(function(posts)  {
    posts.forEach(function(post) {
        feed.item({
            title: post.title,
            description: post.body,
            url: 'http://blog.liushuping.com/' + post.id + '/' + post.slug,
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
