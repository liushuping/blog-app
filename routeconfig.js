var sitemap = require('./routes/sitemap');
var rss = require('./routes/rss');
var index = require('./routes/index');
var post = require('./routes/post');
var users = require('./routes/users');

function config(app) {

    app.use(sitemap);
    app.use(rss);
    app.use(index);
    app.use(post);

    /// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
}

exports.config = config;
