var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.user) {
    res.redirect("/");
  } else if (!req.user.schedule || req.user.schedule.length != 7) {
    res.redirect("/edit");
  } else {
      
      for (var thisClass of req.user.schedule) {
        if (!thisClass.classCode || !thisClass.section || thisClass.classCode.length === 0 || thisClass.section.length === 0) {
          res.redirect("/edit");
          return;
        }
      }
    // var classes = req.user.schedule;
    // for (thisClass of classes) {
    //   Class.
    // }
    res.render('results', {user: req.user });
  }
});

module.exports = router;
