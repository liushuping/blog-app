var express = require('express');
var router = express.Router();
var sitemap = require('./sitemap');
var rss = require('./rss');
var home = require('./home');
var post = require('./post');

function routes(app) {

    app.use(sitemap);
    app.use(rss);
    app.use(home);
    app.use(post);

    /// catch 404 and forward to error handler
    router.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
}

module.exports = routes;
