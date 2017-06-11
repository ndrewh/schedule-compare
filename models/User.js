var thinky = require(__dirname+'/../util/thinky.js');
var type = thinky.type;

module.exports = thinky.createModel("User", {
    id: type.string(),
    userID: type.string(),
    email: type.string(),
    name: type.string(),
    myNames: [type.string()]
});
