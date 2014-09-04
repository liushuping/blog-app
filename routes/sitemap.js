var express = require('express');
var router = express.Router();
var postsLib = require('../lib/posts');
var settings = require('../lib/settings');
var sm = require('sitemap');
var sitemap;

postsLib.getAll(function(posts)  {
    var title = settings.site_title;
    
    var urls = posts.map(function(post) {
	return {
	    url: post.id + '/' + post.slug
	}
    });
        
    sitemap = sm.createSitemap ({
        hostname: settings.site_home,
        cacheTime: 600000,        // 600 sec - cache purge period
        urls: urls
    });
});


router.get('/sitemap.xml', function(req, res) {
  sitemap.toXML(function (xml) {
      res.header('Content-Type', 'application/xml');
      res.send(xml);
  });
});

module.exports = router;
