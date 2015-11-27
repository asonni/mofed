var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

// set up a mongoose model
var Mofednid = new Schema({
    nid: Number,
    name: {type: String, index: true},
    regnum: Number,
    dob: String,
    pob: String,
    mothername:{type: String, index: true},
    familynum : Number
});
Mofednid.plugin(timestamps);
module.exports = mongoose.model('Mofednid', Mofednid);