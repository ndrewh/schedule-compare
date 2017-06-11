// This file is just some fun analysis I was running on the collected data

var thinky = require('./util/thinky.js');
var type = thinky.type;

var User = require('./models/User');
var Class = require('./models/Class');

var pairs = [];

/*************************************
 * Find pairs of students who share the most
 * classes in common.
 *************************************/


User.getJoin({schedule: {students: true}}).then(function (results) {
    var filtered = [];
    for (var user of results) {
        if (user.myNames && user.schedule && user.schedule.length == 7) {
            filtered.push(user);
        }
    }
    console.log("Count: "+filtered.length);
    for (var i1=0; i1<filtered.length; i1++) {
        for (var i2=i1+1; i2<filtered.length; i2++) {
            var user = filtered[i1];
            var user2 = filtered[i2];
            var count = 0;
            for (var i=0; i<7; i++) {
                var c1 = user.schedule.find(function(c) { return c.period === i+1 });
                var c2 = user2.schedule.find(function(c) { return c.period === i+1 })
                if (c1.classCode.length == 0 || c1.section.length == 0 || c2.classCode.length == 0 || c2.section.length == 0) {
                    count = 0;
                    break;
                }
                if (c1.classCode == c2.classCode && c1.section == c2.section) {
                    count++;
                }
            }
            
            if (count > 1) {
                pairs.push({users:[user, user2], c:count});
            }
        }
    }
    
    pairs.sort(function(a, b) {
        if (a.c > b.c) return -1;
        if (a.c < b.c) return 1;
        return 0;
    })
    for (var pair of pairs) {
        console.log(pair.c+": "+pair.users[0].name+" - "+pair.users[1].name)
    }
    console.log("Done");
}).error(function (err) {
    callback(null, err);
});
