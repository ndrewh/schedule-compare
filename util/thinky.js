// file: util/thinky.js
var config = require("../config.json")
var thinky = require('thinky')({
    host: config.rethinkdbHost,
    port: 28015,
    db: config.rethinkdbTable
});

module.exports = thinky;
