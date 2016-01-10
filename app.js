var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var redis = require("redis"),
    client = redis.createClient();
var RedisStore = require('connect-redis')(session);
var autoconfirm = require('./controller/autoconfirm');

var routes = require('./routes/index');
var user = require('./routes/user');
var admin = require('./routes/admin');

var app = express();

var mongoose = require('mongoose');
var config = require('./config'); // get our config file

var options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  user: config.user,
  pass: config.password
}
mongoose.connect(config.url, options);

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views/pages')));
// app.use(session({secret: 'mofed_app',resave: true,saveUninitialized: true}));
app.use(session({store: new RedisStore({
  client: client,
  host:'127.0.0.1',
  port:6379,
  prefix:'sess'
}), secret: 'SEKR37' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/user', user);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//autoconfirm.check();
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
