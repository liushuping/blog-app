var express = require('express');
var router = express.Router();
var sitemap = require('./sitemap');
var rss = require('./rss');
var home = require('./home');
var post = require('./post');
var notfound = require('./404');
var error = require('./error');

module.exports = function(app) {

    app.use(sitemap);
    app.use(rss);
    app.use(home);
    app.use(post);
    app.use(notfound);
    app.use(error);
}
