// This script is just some fun analysis I was doing on the collected data

// Thinky
var thinky = require('./util/thinky.js');
var type = thinky.type;

var User = require('./models/User');
var Class = require('./models/Class');

// This code counts AP classes

// User.run().then(function (results) {
//     var filtered = [];
//     for (var user of results) {
//         if (user.myNames) {
//             filtered.push(user);
//         }
//     }
//     filtered.sort(compareUser);
//     for (var user of filtered) {
//         var aCount = 0;
//         for (var name of user.myNames) {
//             if (name.includes("AP")) {
//                 aCount++;
//             }
//         }
//         console.log(user.name+": "+aCount);
//     }
// }).error(function (err) {
//     callback(null, err);
// });

function compareUser(a, b) {
  var aCount = 0;
  var bCount = 0;
  for (var name of a.myNames) {
      if (name.includes("AP")) {
          aCount++;
      }
  }
  
  for (var name of b.myNames) {
      if (name.includes("AP")) {
          bCount++;
      }
  }
  
  if (aCount > bCount) {
    return -1;
  }
  if (aCount < bCount) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

/*************************************
 *  Determine most popular classes
 *************************************/
 
// Class.getJoin({students: true}).then(function (results) {
//     results.sort(compareClass);
//     for (var section of results) {
//         if (section.students.length < 2 || !section.students[0].myNames[section.period-1]) continue;
//         console.log(section.students.length+" students - "+section.students[0].myNames[section.period-1]+" - Period "+section.period+" ("+section.classCode+" - "+section.section+")");
//     }
// }).error(function (err) {
//     callback(null, err);
// });

function compareClass(a, b) {
  
  if (a.students.length > b.students.length) {
    return -1;
  }
  if (a.students.length < b.students.length) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

/*************************************
 *  Class or User lookup by database ID
 *************************************/

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
// rl.question("Enter user ID: ", (id) => {
//     User.get(id).getJoin({schedule: {students: true}}).then( function(user) {
//       for (var i=1; i<=7; i++) {
//           var thisClass = user.schedule.find((a) => { return a.period == i });
//           console.log(i+": "+user.myNames[i-1]);
//           for (student of thisClass.students) {
//               console.log("  - "+student.name);
//           }
//       }
//   }).error(function (e) { console.log("fail: "+e); });
// })

rl.question("Enter class ID: ", (id) => {
    Class.get(id).getJoin({students: {schedule: true}}).then( function(c) {
      for (var user of c.students) {
          console.log(user.name);
          for (var i=1; i<=7; i++) {
              var thisClass = user.schedule.find((a) => { return a.period == i });
              console.log("    - "+i+": "+user.myNames[i-1]);
            //   for (student of thisClass.students) {
            //       console.log("  - "+student.name);
            //   }
          }
      }
  }).error(function (e) { console.log("fail: "+e); });
})
