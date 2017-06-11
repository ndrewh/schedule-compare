var thinky = require(__dirname+'/../util/thinky.js');
var type = thinky.type;

var Class = thinky.createModel("Class", {
    id: type.string(),
    name: type.string(),
    classCode: type.string(),
    period: type.number(),
    section: type.string()
});

module.exports = Class;

var User = require("./User");
Class.hasAndBelongsToMany(User, "students", "id", "id");
User.hasAndBelongsToMany(Class, "schedule", "id", "id");
