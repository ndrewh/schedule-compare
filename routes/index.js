var express = require('express');
var router = express.Router();
var User = require(__dirname+"/../models/User");

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    if (req.user.schedule.length == 7) {
      for (var thisClass of req.user.schedule) {
          console.log("Class: "+JSON.stringify(thisClass));
        if (!thisClass.classCode || !thisClass.section || thisClass.classCode.length === 0 || thisClass.section.length === 0) {
          res.redirect("/edit");
          return;
        }
      }
      res.redirect("/results");
    } else res.redirect("/edit");
  } else {
    User.count().execute().then(function (count) {
        res.render('index', { message: "yo", messages: req.flash('error'), userCount: count });
    })
  }
});

router.get('/demo/:userID', function(req, res, next) {
  findOrCreateUser({userID: req.params.userID, email: "demo@demo.com", name: "Demo "+req.params.userID}, function(usr, err) {
    if (err) { return next(err); }
    req.login(usr, function (err) {
      if (err) { return next(err); }
      return res.redirect("/edit");
    });
  });
});

function findOrCreateUser(data, callback) {
    User.getAll(data.userID, {index: "userID"}).then(function (results) {
      if (results.length === 0) {
          var newUser = new User({
              userID: data.userID,
              email: data.email,
              name: data.name
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
module.exports = router;
