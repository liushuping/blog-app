var express = require('express');
var router = express.Router();
var settings = require('../lib/settings');
var postsLib = require('../lib/posts');

router.get('/', function(req, res) {
    postsLib.getAll(function(posts)  {
        var title = settings.site_title;
        posts = posts.sort(function(p1, p2) {
            return p2.id - p1.id;
        });
	var body = {
	    posts: posts,
	    title: title,
	    canonical: settings.site_home,
	    keywords: settings.site_keywords,
	    description: settings.description
        };

        res.render('home', body);
    });
});

module.exports = router;
