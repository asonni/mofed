var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

// set up a mongoose model
var Mofednid = new Schema({
    nid: {type: String, index: true},
    name: {type: String, index: true},
    regnum: {type: String, index: true},
    dob: String,
    pob: String,
    mothername:{type: String, index: true},
    familynum : {type: String, index: true}
});
Mofednid.plugin(timestamps);
module.exports = mongoose.model('Mofednid', Mofednid);