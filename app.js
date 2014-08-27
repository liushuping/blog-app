var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routeconfig = require('./routeconfig');
var errorhandlers = require('./errorhandlers');
var app = express();
var cacheTime = 7*24*60*60*1000;

app.disable('x-powered-by');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('env', process.env.NODE_ENV || 'production');

app.use(compression());
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: cacheTime }));

routeconfig.config(app);
errorhandlers.handle(app)

module.exports = app;
