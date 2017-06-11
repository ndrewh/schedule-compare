var express = require('express');
var router = express.Router();
var Class = require(__dirname+"/../models/Class");
var thinky = require(__dirname+'/../util/thinky.js');
var r = thinky.r;

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.user) {
    res.redirect("/");
} else if (!req.user.name) {
    res.redirect("/edit/changename");
} else {
    res.render('dashboard', { user: req.user, messages: req.flash('error') });
  }
});

router.get('/changename', function(req, res, next) {
  if (!req.user || req.user.name) {
    res.redirect("/");
  } else {
    res.render('changename', { user: req.user, messages: req.flash('error') });
  }
});

router.post('/changename', function(req, res, next) {
  if (!req.user || req.user.name) {
    res.redirect("/");
  } else {
    req.user.name = req.body["name"];
    req.user.saveAll().then(function (result) {
        console.log("saved name");
        res.redirect("/");
    })
  }
});

router.post('/', function(req, res, next) {
  if (!req.user) {
    res.redirect("/");
    return;
  }
  var saved = 0;
  req.user.schedule = [];
  req.user.myNames = [];
  var failed = false;
  for (var idx=1; idx <= 7; idx++) {
    var classCode = req.body["class"+idx];
    var section = req.body["section"+idx];
    if (classCode.length === 0 || section.length === 0) {
      failed = true;
    }
    var className = req.body["name"+idx];
    req.user.myNames.push(className);

    //console.log(JSON.stringify(req.body));
    console.log(classCode+" - "+section+" - "+className);
    findOrCreateClass(idx, classCode, section, function(obj, err) {
      if (err) { res.status(500); res.send("An error ocurred"); return; }
      req.user.schedule.push(obj);
      if (++saved === 7) {
        // Done
        console.log("Saved all");
        req.user.saveAll({schedule: true}).then(function (result){
          console.log("Saved Schedule");
          if (failed) {
            req.flash('error', 'You must provide a class code and section number for each class');
            res.render('dashboard', { user: req.user, messages: req.flash('error') });
          } else {
            res.redirect("/results");
          }
        }).error(function (e) {
          console.log(e);
        });
      }
    });
  }

});

function findOrCreateClass(period, code, section, callback) {
  Class.filter({period: period, classCode: code, section: section}).then(function (results) {
    if (results.length === 0) {
        var newClass = new Class({
            period: period,
            classCode: code,
            section: section
        });
        newClass.save().then(callback).error(function (e) {
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
