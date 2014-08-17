var express = require('express');
var router = express.Router();
var params = require('express-params');
var posts = require('../lib/posts');

params.extend(router);

router.param('id', /^\d+$/);
router.param('slug', /^.*$/);

router.get('/:id', handler);
router.get('/:id/:slug', handler);

function handler(req, res, next) {
    posts.get(req.params.id, function(post) {
        if (post.id == undefined) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
            return;
        }

        var slug = post.slug;

	post.description = post.title + '-刘淑平的Blog';
	post.keywords = post.tags.join(',');
	post.created_on = extractDate(post.created_on);

        var url = '/' + req.params.id + '/' + slug;
	post.canonical = 'http://blog.liushuping.com' + url;

        if (req.params.slug != slug) {
            res.redirect(url);
        } else {
            res.render('post', post);
        }
    });
};

function extractDate(timeStr) {
    var pattern = /^\d{4}-\d{2}-\d{2}/;
    var matches = pattern.exec(timeStr);
    return matches[0];
}

module.exports = router;
