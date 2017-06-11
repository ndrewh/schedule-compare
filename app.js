// app.js: main file for setting up application and routes
// Much of this code could go in separate files and there
// are a lot of other patterns out there too.

// directory used to lookup names of students based on email address
// It's just a map from email address to name. It was pulled from gmail directory
var schoolDirectory = require("./directory.json");

var config = require("./config.json");

// Dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require("express-session");
var RedisStore = require('connect-redis')(session);

// Thinky (ORM for RethinkDB)
var thinky = require('./util/thinky.js');
var type = thinky.type;

// Models
var User = require('./models/User');

// Include controllers from routes/ directory
var routes = require('./routes/index');
var users = require('./routes/users');
var dashboard = require('./routes/dashboard');
var results = require('./routes/results');

// Setup express app

var app = express();
app.locals.pretty = true;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ store: new RedisStore({host: config.redis}), secret: config.redisSecret }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy(config.google,
  function(accessToken, refreshToken, profile, done) {
      if (profile._json.domain != config.domain) {
        done(null, false, {message: "You must use your school account"});
        return;
      }
      findOrCreateUser(profile, function (user, err) {
          if (err) {
            console.log("error finding or creating user: "+err);
          }
          console.log("User found or created: "+JSON.stringify(user));
          return done(err, user);
      });
  }
));

// User serialization

function findOrCreateUser(profile, callback) {
    User.getAll(profile.id, {index: "userID"}).then(function (results) {
      if (results.length === 0) {
          var newUser = new User({
              userID: profile.id,
              email: profile.emails[0].value,
              name: schoolDirectory[profile.emails[0].value]
          });
          newUser.saveAll().then(callback).error(function (e) {
              callback(null, e);
          });
      } else {
          callback(results[0]);
      }
    }).error(function (err) {
        callback(null, err);
    });
}

passport.serializeUser(function(user, done) {
  done(null, user.userID);
});

passport.deserializeUser(function(id, done) {
  User.getAll(id, {index: "userID"}).getJoin({schedule: {students: true}}).then( function(results) {
    if (results.length == 1) done(null, results[0]);
    else done(new Error("User not found or not unique"), null);
  }).error(function (e) { done(err, null); });
});


// Routes

app.use('/', routes);
//app.use('/users', users);
app.use("/results", results);
app.use('/edit/', dashboard);
app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});
app.get('/auth/google',
  passport.authenticate('google', { scope: ["openid email"] }));
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/', failureFlash: true}),
    function(req, res) {
      res.redirect('/');
    }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development' && false /* intentionally disabled */) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
    req.session.destroy();
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
  req.session.destroy();
});


module.exports = app;
