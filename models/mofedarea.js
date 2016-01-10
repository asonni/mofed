var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

// set up a mongoose model
var Mofedarea = new Schema({
    nid: String,
    job: String,
    area: String,
});
Mofedarea.plugin(timestamps);
module.exports = mongoose.model('Mofedarea', Mofedarea);