function handle(app) {

    function onerror(dev) {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: dev ? err : {}
            });
        });
    }

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        onerror(true);
    }

    // production error handler
    // no stacktraces leaked to user
    onerror(false);
}

exports.handle = handle;
