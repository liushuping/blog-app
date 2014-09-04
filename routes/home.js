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
	    author: settings.site_owner,
	    canonical: settings.site_home,
	    keywords: settings.site_keywords,
	    description: settings.site_description,
	    metas: settings.site_metas
        };

        res.render('home', body);
    });
});

module.exports = router;
