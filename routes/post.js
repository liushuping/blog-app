var express = require('express');
var router = express.Router();
var params = require('express-params');
var posts = require('../lib/posts');
var settings = require('../lib/settings');

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

	post.description = post.title + ' | ' + settings.post_title_addon;
	post.keywords = post.tags.join(',');
        post.author = settings.site_owner;
	post.created_on = extractDate(post.created_on);

        var url = req.params.id + '/' + slug;
	post.canonical = settings.site_home+ url;

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
